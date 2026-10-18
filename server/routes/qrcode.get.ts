import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const qrImage = require('qr-image') as {
  imageSync: (text: string, options: { type: string; size: number }) => Buffer
}

/**
 * GET /qrcode?url=https://example.com
 * 生成二维码图片。
 */
export default defineEventHandler((event) => {
  const { url } = getQuery(event)

  if (typeof url !== 'string' || !url) {
    setResponseStatus(event, 400)
    return {
      code: -1,
      msg: '请以类似https://brofen.cn/qrcode/?url=https://brofen.cn/的url格式请求',
    }
  }

  try {
    const image = qrImage.imageSync(url, { type: 'png', size: 6 })
    setResponseHeader(event, 'Content-Type', 'image/png')
    return image
  } catch (error) {
    console.error('[QRCode] 生成二维码失败', error)
    setResponseStatus(event, 500)
    return {
      code: -1,
      msg: '二维码生成失败',
    }
  }
})
