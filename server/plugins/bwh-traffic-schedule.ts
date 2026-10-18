import { sendBwhTrafficReport } from '~~/server/utils/bwh-traffic-report'
import { getMillisecondsUntilNextShanghaiEight } from '~~/server/utils/bwh-traffic-schedule'

/**
 * BWH 每日汇报调度。
 * 默认关闭；生产按实际调度需要通过环境变量启用。
 */
export default defineNitroPlugin((nitroApp) => {
  if (process.env.BWH_TRAFFIC_SCHEDULE_ENABLED !== 'true') {
    return
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  let closed = false

  const scheduleNext = () => {
    if (closed) {
      return
    }

    const delay = getMillisecondsUntilNextShanghaiEight(new Date())
    timer = setTimeout(async () => {
      try {
        const result = await sendBwhTrafficReport()
        console.info(`[BwhTrafficReport] 发送成功: ${result.usagePercent}%`)
      } catch (error) {
        const message = error instanceof Error ? error.message : '未知错误'
        console.error(`[BwhTrafficReport] 执行异常: ${message}`)
      } finally {
        scheduleNext()
      }
    }, delay)
  }

  scheduleNext()

  nitroApp.hooks.hook('close', () => {
    closed = true
    if (timer) {
      clearTimeout(timer)
    }
  })
})
