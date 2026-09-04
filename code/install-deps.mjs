import { spawnSync } from 'node:child_process'

if (process.platform !== 'linux') {
  console.log('[安装] 非 Linux 环境，跳过 Chromium 系统依赖')
  process.exit(0)
}

const command = 'apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends libnspr4 libnss3'
console.log('[安装] 正在安装 Chromium 系统依赖：libnspr4、libnss3')
const result = spawnSync('sh', ['-lc', command], { stdio: 'inherit' })

if (result.error?.code === 'ENOENT') {
  console.error('[安装] 未找到 apt-get，请手动安装 libnspr4 和 libnss3')
  process.exit(1)
}

process.exit(result.status ?? 1)
