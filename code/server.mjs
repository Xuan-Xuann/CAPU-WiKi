import { createServer } from 'node:http'
import {
  CACHE_DIR,
  CACHE_TTL,
  MAX_CONCURRENT_SYNCS,
  MAX_SYNC_QUEUE,
  SyncQueueFullError,
  cacheKey,
  fromCache,
  isTencentSheetUrl,
  log,
  refreshCache,
  ts,
} from './xlsx-sync.mjs'

const PORT = Number(process.env.PORT || 3456)
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60 * 1000)
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 60)
const requestTimes = []

if (!Number.isInteger(RATE_LIMIT_WINDOW_MS) || RATE_LIMIT_WINDOW_MS < 1000) {
  throw new Error('RATE_LIMIT_WINDOW_MS 必须是大于或等于 1000 的整数')
}
if (!Number.isInteger(RATE_LIMIT_MAX_REQUESTS) || RATE_LIMIT_MAX_REQUESTS < 1) {
  throw new Error('RATE_LIMIT_MAX_REQUESTS 必须是大于 0 的整数')
}

function json(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  })
  res.end(JSON.stringify(data))
}

function methodNotAllowed(res) {
  res.setHeader('Allow', 'GET, OPTIONS')
  return json(res, { error: '仅支持 GET 请求' }, 405)
}

function sendXlsx(res, buffer, cacheStatus) {
  res.writeHead(200, {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Length': buffer.length,
    'Access-Control-Allow-Origin': '*',
    'X-Cache': cacheStatus,
  })
  res.end(buffer)
}

function isRateLimited() {
  const now = Date.now()
  while (requestTimes.length && requestTimes[0] <= now - RATE_LIMIT_WINDOW_MS) requestTimes.shift()
  if (requestTimes.length >= RATE_LIMIT_MAX_REQUESTS) return true
  requestTimes.push(now)
  return false
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
    })
    return res.end()
  }
  if (req.method !== 'GET') return methodNotAllowed(res)

  let requestUrl
  try {
    requestUrl = new URL(req.url, 'http://localhost')
  } catch {
    return json(res, { error: '无效请求 URL' }, 400)
  }
  if (requestUrl.pathname === '/health') return json(res, { ok: true })

  const docUrl = requestUrl.searchParams.get('url')
  if (requestUrl.pathname !== '/api/xlsx' || !docUrl) {
    return json(res, { error: '用法：/api/xlsx?url=<腾讯文档链接>' }, 400)
  }
  if (isRateLimited()) {
    res.setHeader('Retry-After', Math.ceil(RATE_LIMIT_WINDOW_MS / 1000))
    return json(res, { error: '请求过于频繁，请稍后重试' }, 429)
  }
  if (!isTencentSheetUrl(docUrl)) {
    return json(res, { error: '仅支持 https://docs.qq.com/sheet/ 链接' }, 400)
  }
  if (requestUrl.searchParams.has('force')) {
    return json(res, { error: 'force 参数已禁用' }, 400)
  }

  const key = cacheKey(docUrl)
  log(`收到请求 ${key}`)

  try {
    const cached = fromCache(key)
    if (cached) {
      log('  → 命中缓存')
      return sendXlsx(res, cached, 'HIT')
    }

    log('  → 开始同步')
    const { buffer } = await refreshCache(docUrl)
    log(`  → 同步完成，缓存 ${buffer.length} 字节`)
    sendXlsx(res, buffer, 'MISS')
  } catch (error) {
    log(`  → 同步失败：${error.message}`)
    json(
      res,
      { error: error instanceof SyncQueueFullError ? error.message : '同步失败，请稍后重试' },
      error instanceof SyncQueueFullError ? 429 : 502,
    )
  }
})

server.listen(PORT, () => {
  log(`服务已启动 http://localhost:${PORT}`)
  log(`缓存目录：${CACHE_DIR}`)
  log(`缓存有效期：${CACHE_TTL / 60000} 分钟`)
  log(`请求限制：每 ${RATE_LIMIT_WINDOW_MS / 1000} 秒 ${RATE_LIMIT_MAX_REQUESTS} 次`)
  log(`同步限制：并发 ${MAX_CONCURRENT_SYNCS}，排队 ${MAX_SYNC_QUEUE}`)
}).on('error', error => {
  console.error(`[${ts()}] 启动失败：${error.message}`)
  process.exit(1)
})
