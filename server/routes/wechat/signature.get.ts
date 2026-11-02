import { createWechatJsSdkSignature } from '~~/server/utils/wechat-js-sdk'

function getAllowedOrigins() {
  const configured = process.env.WECHAT_JS_SDK_ALLOWED_ORIGINS
    ?.split(',')
    .map(origin => origin.trim())
    .filter(Boolean) ?? []

  if (configured.length === 0) {
    throw createError({ statusCode: 503, statusMessage: '微信分享来源白名单未配置' })
  }

  return configured.map(origin => {
    try {
      const parsed = new URL(origin)
      if (parsed.protocol !== 'https:' || parsed.origin !== origin) {
        throw new Error('origin must be an HTTPS origin without a path')
      }
      return parsed.origin
    } catch {
      throw createError({ statusCode: 503, statusMessage: '微信分享来源白名单配置无效' })
    }
  })
}

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  setResponseHeader(event, 'Vary', 'Origin')

  const queryUrl = getQuery(event).url
  const url = typeof queryUrl === 'string' ? queryUrl.split('#', 1)[0] : ''
  if (!url || url.length > 4096) {
    throw createError({ statusCode: 400, statusMessage: '分享页面 URL 无效' })
  }

  let pageUrl: URL
  try {
    pageUrl = new URL(url)
  } catch {
    throw createError({ statusCode: 400, statusMessage: '分享页面 URL 无效' })
  }
  if (pageUrl.protocol !== 'https:' || pageUrl.username || pageUrl.password) {
    throw createError({ statusCode: 400, statusMessage: '分享页面必须使用 HTTPS 地址' })
  }

  const allowedOrigins = getAllowedOrigins()
  const requestOrigin = getRequestHeader(event, 'origin')
  if (!allowedOrigins.includes(pageUrl.origin) || (requestOrigin && requestOrigin !== pageUrl.origin)) {
    throw createError({ statusCode: 403, statusMessage: '分享页面来源不在白名单中' })
  }
  if (requestOrigin) {
    setResponseHeader(event, 'Access-Control-Allow-Origin', requestOrigin)
  }

  if (!process.env.WECHAT_OFFICIAL_ACCOUNT_APP_ID?.trim() || !process.env.WECHAT_OFFICIAL_ACCOUNT_APP_SECRET?.trim()) {
    throw createError({ statusCode: 503, statusMessage: '微信签名凭据未配置' })
  }

  try {
    return await createWechatJsSdkSignature(url)
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误'
    console.error(`[WechatSignature] 签名生成失败: ${message}`)
    throw createError({ statusCode: 502, statusMessage: '微信签名生成失败' })
  }
})
