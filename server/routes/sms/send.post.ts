import { sendSms } from '~~/server/utils/aliyun-sms'

interface SmsRequestBody {
  msg?: unknown
  telephone?: unknown
}

export default defineEventHandler(async (event) => {
  const configuredToken = process.env.SMS_SEND_TOKEN?.trim()
  const requestToken = getRequestHeader(event, 'x-sms-token')?.trim()

  if (!configuredToken || requestToken !== configuredToken) {
    setResponseStatus(event, 401)
    return {
      code: 401,
      msg: '无权发送短信。',
    }
  }

  let body: SmsRequestBody | undefined

  try {
    body = await readBody<SmsRequestBody>(event)
  } catch {
    setResponseStatus(event, 400)
    return {
      code: 400,
      msg: '请求体必须是有效的 JSON。',
    }
  }

  const msg = typeof body?.msg === 'string' ? body.msg.trim() : ''
  const telephone = typeof body?.telephone === 'string' ? body.telephone.trim() : ''

  if (!msg || msg.length > 64 || !/^1[3-9]\d{9}$/.test(telephone)) {
    setResponseStatus(event, 400)
    return {
      code: 400,
      msg: 'msg 必须为 1-64 个字符，telephone 必须为有效的中国大陆手机号。',
    }
  }

  try {
    const data = await sendSms({ msg, telephone })

    return {
      code: 0,
      msg: '短信发送成功。',
      data,
    }
  } catch (error) {
    console.error('[SmsController] 短信发送失败。', error instanceof Error ? error.message : '未知错误')
    setResponseStatus(event, 502)

    return {
      code: 502,
      msg: '短信发送失败，请查看服务端日志。',
    }
  }
})
