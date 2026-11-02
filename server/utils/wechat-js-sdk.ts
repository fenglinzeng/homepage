import { createHash, randomBytes } from 'node:crypto'

const REQUEST_TIMEOUT_MS = 10_000
const CACHE_MARGIN_MS = 60_000

interface WechatApiResponse {
  errcode?: number | string
  errmsg?: string
}

interface AccessTokenResponse extends WechatApiResponse {
  access_token?: unknown
  expires_in?: unknown
}

interface JsapiTicketResponse extends WechatApiResponse {
  ticket?: unknown
  expires_in?: unknown
}

interface CachedValue {
  appId: string
  value: string
  expiresAt: number
}

let accessTokenCache: CachedValue | null = null
let jsapiTicketCache: CachedValue | null = null

async function requestWechatJson<T extends WechatApiResponse>(url: URL): Promise<T> {
  const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
  if (!response.ok) {
    throw new Error(`微信接口返回 HTTP ${response.status}`)
  }

  const payload = await response.json() as T
  if (payload.errcode !== undefined && Number(payload.errcode) !== 0) {
    throw new Error(`微信接口返回错误码 ${payload.errcode}`)
  }

  return payload
}

function cacheIsValid(cache: CachedValue | null, appId: string) {
  return cache?.appId === appId && cache.expiresAt > Date.now() + CACHE_MARGIN_MS
}

async function getAccessToken(appId: string, appSecret: string) {
  if (accessTokenCache && cacheIsValid(accessTokenCache, appId)) {
    return accessTokenCache.value
  }

  const url = new URL('https://api.weixin.qq.com/cgi-bin/token')
  url.search = new URLSearchParams({
    grant_type: 'client_credential',
    appid: appId,
    secret: appSecret,
  }).toString()

  const payload = await requestWechatJson<AccessTokenResponse>(url)
  const expiresIn = Number(payload.expires_in)
  if (typeof payload.access_token !== 'string' || !Number.isFinite(expiresIn) || expiresIn <= 0) {
    throw new Error('微信 access_token 响应格式无效')
  }

  accessTokenCache = {
    appId,
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(0, expiresIn * 1000 - CACHE_MARGIN_MS),
  }
  return accessTokenCache.value
}

async function getJsapiTicket(appId: string, appSecret: string) {
  if (jsapiTicketCache && cacheIsValid(jsapiTicketCache, appId)) {
    return jsapiTicketCache.value
  }

  const accessToken = await getAccessToken(appId, appSecret)
  const url = new URL('https://api.weixin.qq.com/cgi-bin/ticket/getticket')
  url.search = new URLSearchParams({ access_token: accessToken, type: 'jsapi' }).toString()

  const payload = await requestWechatJson<JsapiTicketResponse>(url)
  const expiresIn = Number(payload.expires_in)
  if (typeof payload.ticket !== 'string' || !Number.isFinite(expiresIn) || expiresIn <= 0) {
    throw new Error('微信 jsapi_ticket 响应格式无效')
  }

  jsapiTicketCache = {
    appId,
    value: payload.ticket,
    expiresAt: Date.now() + Math.max(0, expiresIn * 1000 - CACHE_MARGIN_MS),
  }
  return jsapiTicketCache.value
}

export async function createWechatJsSdkSignature(url: string) {
  const appId = process.env.WECHAT_OFFICIAL_ACCOUNT_APP_ID?.trim()
  const appSecret = process.env.WECHAT_OFFICIAL_ACCOUNT_APP_SECRET?.trim()
  if (!appId || !appSecret) {
    throw new Error('微信公众平台 AppID / AppSecret 未配置')
  }

  const ticket = await getJsapiTicket(appId, appSecret)
  const timestamp = Math.floor(Date.now() / 1000)
  const nonceStr = randomBytes(16).toString('hex')
  const signature = createHash('sha1')
    .update(`jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`)
    .digest('hex')

  return { appId, timestamp, nonceStr, signature }
}
