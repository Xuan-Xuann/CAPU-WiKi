#!/usr/bin/env node
// 腾讯文档 → XLSX 同步命令行工具（学校 Wiki 通用模板）
import { isTencentSheetUrl, log, refreshCache } from './xlsx-sync.mjs'

function usage() {
  console.error('用法：schoolwiki-sync [腾讯文档链接]')
  console.error('示例：schoolwiki-sync "https://docs.qq.com/sheet/xxxxxxxx"')
  console.error('也可以设置环境变量：SCHOOLWIKI_DOC_URL="https://docs.qq.com/sheet/xxxxxxxx"')
}

const docUrl = process.argv[2] || process.env.SCHOOLWIKI_DOC_URL
if (process.argv.includes('-h') || process.argv.includes('--help')) {
  usage()
  process.exit(0)
}

if (!docUrl) {
  usage()
  process.exit(1)
}

if (!isTencentSheetUrl(docUrl)) {
  console.error('错误：仅支持 https://docs.qq.com/sheet/ 链接')
  process.exit(1)
}

try {
  log('开始强制重新解析腾讯文档')
  const { buffer, file, key } = await refreshCache(docUrl)
  log(`解析完成：${key}`)
  log(`缓存文件：${file}`)
  log(`文件大小：${buffer.length} 字节`)
} catch (error) {
  console.error(`解析失败：${error.message}`)
  process.exit(1)
}
