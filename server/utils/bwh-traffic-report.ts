const REQUEST_TIMEOUT_MS = 30_000

interface BwhTrafficResponse {
  bw_counter_b?: unknown
  monthly_bw_limit_b?: unknown
}

interface WechatWebhookResponse {
  errcode?: unknown
  errmsg?: unknown
}

export interface BwhTrafficReportResult {
  usagePercent: string
  usedGB: string
  limitGB: string
}

function requiredEnv(name: string) {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`缺少环境变量 ${name}`)
  }
  return value
}

function parseBytes(value: unknown, name: string) {
  const numberValue =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim() !== ''
        ? Number(value)
        : Number.NaN

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new Error(`BWH 流量字段 ${name} 无效`)
  }

  return numberValue
}

async function fetchWithTimeout(url: string, init?: RequestInit) {
  return fetch(url, {
    ...init,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
}

/**
 * 获取 BWH 流量数据并发送企业微信 Markdown 汇报。
 * 外部地址只从环境变量读取，避免把原服务中的敏感配置迁入源码。
 */
export async function sendBwhTrafficReport(): Promise<BwhTrafficReportResult> {
  const apiUrl = requiredEnv('BWH_TRAFFIC_API_URL')
  const webhookUrl = requiredEnv('BWH_TRAFFIC_WEBHOOK_URL')

  const response = await fetchWithTimeout(apiUrl)
  if (!response.ok) {
    throw new Error(`BWH 流量接口请求失败: HTTP ${response.status}`)
  }

  const data = await response.json() as BwhTrafficResponse
  const usedBytes = parseBytes(data.bw_counter_b, 'bw_counter_b')
  const limitBytes = parseBytes(data.monthly_bw_limit_b, 'monthly_bw_limit_b')

  if (limitBytes <= 0) {
    throw new Error('BWH 流量字段 monthly_bw_limit_b 无效')
  }

  const usagePercent = (usedBytes / limitBytes * 100).toFixed(2)
  const usedGB = (usedBytes / (1024 ** 3)).toFixed(2)
  const limitGB = (limitBytes / (1024 ** 3)).toFixed(2)
  const message = {
    msgtype: 'markdown',
    markdown: {
      content: `BWH 流量用量报表\n> 当前用量：<font color="warning">${usagePercent}%</font>\n> 已使用：${usedGB} GB\n> 总额度：${limitGB} GB`,
    },
  }

  const webhookResponse = await fetchWithTimeout(webhookUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(message),
  })

  if (!webhookResponse.ok) {
    throw new Error(`企业微信汇报发送失败: HTTP ${webhookResponse.status}`)
  }

  const webhookResult = await webhookResponse.json() as WechatWebhookResponse
  if (webhookResult.errcode !== undefined) {
    const errcode = webhookResult.errcode
    if ((typeof errcode !== 'number' && typeof errcode !== 'string') || Number(errcode) !== 0) {
      const errmsg = typeof webhookResult.errmsg === 'string' ? webhookResult.errmsg : '未知错误'
      throw new Error(`企业微信汇报被拒绝: ${errmsg}`)
    }
  }

  return { usagePercent, usedGB, limitGB }
}
