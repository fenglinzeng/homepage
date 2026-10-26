import DysmsapiClientModule, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525'
import * as $OpenApi from '@alicloud/openapi-client'
import * as $Util from '@alicloud/tea-util'

interface SendSmsInput {
  msg: string
  telephone: string
}

let client: Dysmsapi20170525 | undefined

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`缺少短信配置：${name}`)
  }

  return value
}

function getClient() {
  if (client) {
    return client
  }

  const config = new $OpenApi.Config({
    accessKeyId: getRequiredEnv('ALIBABA_CLOUD_ACCESS_KEY_ID'),
    accessKeySecret: getRequiredEnv('ALIBABA_CLOUD_ACCESS_KEY_SECRET'),
  })
  config.endpoint = 'dysmsapi.aliyuncs.com'
  const DysmsapiClient =
    (DysmsapiClientModule as unknown as { default?: typeof DysmsapiClientModule }).default ??
    DysmsapiClientModule
  client = new DysmsapiClient(config)

  return client
}

function getTemplateParam(msg: string) {
  const configuredParam = process.env.SMS_TEMPLATE_PARAM?.trim()

  if (!configuredParam) {
    return JSON.stringify({ code: msg })
  }

  let params: Record<string, unknown>

  try {
    const parsed = JSON.parse(configuredParam)

    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
      throw new Error('SMS_TEMPLATE_PARAM 必须是 JSON 对象')
    }

    params = parsed as Record<string, unknown>
  } catch {
    throw new Error('SMS_TEMPLATE_PARAM 不是有效的 JSON 对象')
  }

  return JSON.stringify({ ...params, code: msg })
}

export async function sendSms({ msg, telephone }: SendSmsInput) {
  const request = new $Dysmsapi20170525.SendSmsRequest({
    phoneNumbers: telephone,
    signName: getRequiredEnv('SMS_SIGN_NAME'),
    templateCode: getRequiredEnv('SMS_TEMPLATE_CODE'),
    templateParam: getTemplateParam(msg),
  })
  const response = await getClient().sendSmsWithOptions(request, new $Util.RuntimeOptions({}))
  const body = response.body

  if (body?.code !== 'OK') {
    throw new Error('阿里云短信服务返回失败')
  }

  return {
    requestId: body.requestId,
    bizId: body.bizId,
  }
}
