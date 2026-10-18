import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const qrImage = require('qr-image') as {
  imageSync: (text: string, options: { type: string; size: number }) => Buffer
}

/**
 * GET /qrcode?url=https://example.com
 * 迁移自 xEntry/app/controller/qrcode/qrcode.js。
 */
export default defineEventHandler((event) => {
  const { url } = getQuery(event)

  if (typeof url !== 'string' || !url) {
    return {
      code: 0,
      msg: '请以类似https://brofen.cn/qrcode/?url=https://brofen.cn/的url格式请求',
    }
  }

  try {
    setResponseHeader(event, 'Content-Type', 'image/png')
    return qrImage.imageSync(url, { type: 'png', size: 6 })
  } catch (error) {
    setResponseStatus(event, 500)
    return {
      msg: '错误',
      log: error,
    }
  }
})
