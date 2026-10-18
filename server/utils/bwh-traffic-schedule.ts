const SHANGHAI_OFFSET_MS = 8 * 60 * 60 * 1000

/**
 * 计算距离 Asia/Shanghai 下一次 08:00 的毫秒数。
 * 上海全年使用 UTC+8，因此这里不依赖容器的系统时区。
 */
export function getMillisecondsUntilNextShanghaiEight(now: Date): number {
  const localNow = new Date(now.getTime() + SHANGHAI_OFFSET_MS)
  const nextLocal = new Date(localNow)
  nextLocal.setUTCHours(8, 0, 0, 0)

  if (nextLocal.getTime() <= localNow.getTime()) {
    nextLocal.setUTCDate(nextLocal.getUTCDate() + 1)
  }

  return nextLocal.getTime() - localNow.getTime()
}
