import tencentcloud from 'tencentcloud-sdk-nodejs'
import type { H3Event } from 'h3'

/**
 * 腾讯云轻量应用服务器 Lighthouse SDK 客户端
 * 迁移自原 Egg 项目: app/controller/tencent/index.js
 */
const LighthouseClient = tencentcloud.lighthouse.v20200324.Client

// 腾讯云配置：凭据必须通过环境变量注入，不在源码中提供默认值
export const tencentConfig = {
  secretId: process.env.TENCENT_SECRET_ID || '',
  secretKey: process.env.TENCENT_SECRET_KEY || '',
  region: process.env.TENCENT_LIGHTHOUSE_REGION || 'ap-shanghai',
  instanceId: process.env.TENCENT_LIGHTHOUSE_INSTANCE_ID || '',
}

interface OpenPortOptions {
  exposePort?: boolean
}

/**
 * 通用防火墙端口开放逻辑
 * @param event H3Event Nitro 请求事件对象
 * @param port 开放的端口号（如 3306、20202）
 * @param description 防火墙规则备注
 */
export async function handleOpenPort(
  event: H3Event,
  port: string | number,
  description: string,
  options: OpenPortOptions = {}
) {
  const portStr = String(port)
  const exposePort = options.exposePort ?? true
  const portLabel = exposePort ? `${portStr} 端口` : '目标端口'
  const portData = exposePort ? { port: portStr } : {}
  const query = getQuery(event)
  // 是否需要清理旧规则，仅当 query 参数传入 clear=1 时执行清理
  const shouldClear = query.clear === '1'

  // 1. 获取客户端访问真实公网 IP（优先按代理头顺序提取）
  const realIpHeader = getRequestHeader(event, 'x-real-ip')
  const forwardedHeader = getRequestHeader(event, 'x-forwarded-for')
  const clientIp =
    realIpHeader ||
    (forwardedHeader ? forwardedHeader.split(',')[0].trim() : '') ||
    getRequestIP(event, { xForwardedFor: true }) ||
    event.node.req.socket.remoteAddress ||
    ''

  // 安全检查：非法或本地环回 IP 拦截保护
  if (!clientIp || clientIp === '127.0.0.1' || clientIp === '::1') {
    return {
      code: -1,
      msg: `无法获取到有效的公网IP，当前获取到的IP为: ${clientIp}`,
    }
  }

  // 配置有效性检查
  if (!tencentConfig.secretId || !tencentConfig.secretKey) {
    return {
      code: -1,
      msg: '请先配置腾讯云凭据（TENCENT_SECRET_ID、TENCENT_SECRET_KEY）',
    }
  }

  if (!tencentConfig.instanceId || tencentConfig.instanceId === 'lhins-xxxxxxxx') {
    return {
      code: -1,
      msg: '请先配置轻量应用服务器的实例ID (instanceId，如 lhins-xxxxxxxx)',
    }
  }

  // 2. 初始化腾讯云 Lighthouse 客户端实例
  const client = new LighthouseClient({
    credential: {
      secretId: tencentConfig.secretId,
      secretKey: tencentConfig.secretKey,
    },
    region: tencentConfig.region,
    profile: {
      httpProfile: {
        endpoint: 'lighthouse.tencentcloudapi.com',
      },
    },
  })

  try {
    // 3. 查询当前轻量服务器现存的防火墙规则集合
    const describeRes = await client.DescribeFirewallRules({
      InstanceId: tencentConfig.instanceId,
    })
    let rules = describeRes.FirewallRuleSet || []

    // 4. 若传入 clear=1，则清理历史同端口且同备注的临时规则（防止安全组上限堆积）
    if (shouldClear) {
      const oldTempRules = rules.filter(
        (r: any) => r.Port === portStr && r.FirewallRuleDescription === description
      )
      if (oldTempRules.length > 0) {
        await client.DeleteFirewallRules({
          InstanceId: tencentConfig.instanceId,
          FirewallRules: oldTempRules.map((r: any) => ({
            Protocol: r.Protocol,
            Port: r.Port,
            CidrBlock: r.CidrBlock,
            Action: r.Action,
          })),
        })

        // 重新过滤排除已被清理的旧规则
        rules = rules.filter((r: any) => !oldTempRules.includes(r))
      }
    }

    // 5. 检查当前访问者的 IP 是否已存在白名单中（避免重复调用腾讯云 API）
    const exists = rules.some(
      (r: any) =>
        r.Port === portStr &&
        (r.CidrBlock === clientIp || r.CidrBlock === `${clientIp}/32`) &&
        r.Action === 'ACCEPT'
    )

    if (exists) {
      return {
        code: 0,
        msg: `当前IP [${clientIp}] 已在 ${portLabel}白名单中，无需重复添加${shouldClear ? '（已执行旧规则清理）' : ''}`,
        data: {
          ip: clientIp,
          ...portData,
          cleared: shouldClear,
        },
      }
    }

    // 6. 调用腾讯云 API 新增防火墙规则：对当前访问 IP 放行指定端口
    const createRes = await client.CreateFirewallRules({
      InstanceId: tencentConfig.instanceId,
      FirewallRules: [
        {
          Protocol: 'TCP',
          Port: portStr,
          CidrBlock: clientIp,
          Action: 'ACCEPT',
          FirewallRuleDescription: description,
        },
      ],
    })

    return {
      code: 0,
      msg: `成功为当前IP [${clientIp}] 开放轻量服务器 ${portLabel}${shouldClear ? '（已清理旧规则）' : ''}`,
      data: {
        ip: clientIp,
        ...portData,
        cleared: shouldClear,
        ...(exposePort ? { result: createRes } : {}),
      },
    }
  } catch (err: any) {
    console.error(`[Lighthouse Firewall Error - Port ${portStr}]`, err)
    return {
      code: 500,
      msg: exposePort ? err.message || `操作轻量服务器防火墙(${portStr})失败` : '操作轻量服务器防火墙失败',
      ...(exposePort ? { error: err } : {}),
    }
  }
}
