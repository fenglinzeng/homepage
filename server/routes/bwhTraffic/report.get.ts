import { sendBwhTrafficReport } from '~~/server/utils/bwh-traffic-report'

/**
 * GET /bwhTraffic/report
 * 手动触发 BWH 流量用量汇报。
 */
export default defineEventHandler(async (event) => {
  const configuredToken = process.env.BWH_TRAFFIC_REPORT_TOKEN?.trim()
  const requestToken = getRequestHeader(event, 'x-bwh-traffic-token')

  if (!configuredToken) {
    setResponseStatus(event, 503)
    return {
      success: false,
      message: '未配置 BWH_TRAFFIC_REPORT_TOKEN，手动汇报接口暂不可用。',
    }
  }

  if (requestToken !== configuredToken) {
    setResponseStatus(event, 401)
    return {
      success: false,
      message: '无权触发 BWH 流量汇报。',
    }
  }

  try {
    await sendBwhTrafficReport()

    return {
      success: true,
      message: 'BWH 流量汇报已发送。',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误'
    console.error(`[BwhTrafficController] 手动汇报失败: ${message}`)
    setResponseStatus(event, 502)

    return {
      success: false,
      message: '手动汇报触发失败，请查看服务端日志。',
    }
  }
})
