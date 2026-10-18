# BWH Traffic Report Implementation Record

## 目标

在 homepage 中提供 BWH 流量汇报接口和每日 08:00 定时任务。

## 方案

homepage 使用 Nitro 原生路由和 Node 22 全局 `fetch` 完成流量查询及企业微信通知；API 地址、Webhook 和访问令牌只从环境变量读取。定时任务作为 Nitro server plugin 运行，默认关闭，启用后按 Asia/Shanghai 每日 08:00 调用同一份汇报逻辑。

## 约束

- 不将外部地址、Webhook key 或其他敏感值写入源码或 Git。
- 手动触发接口必须通过 `BWH_TRAFFIC_REPORT_TOKEN` 和 `x-bwh-traffic-token` 请求头校验。
- 保留流量字段、百分比/GB 计算和企业微信 Markdown 文案。
- `BWH_TRAFFIC_SCHEDULE_ENABLED` 默认必须为 `false`；生产环境按实际需要启用。
- 当前使用单个 homepage 容器；多实例部署会导致定时任务重复执行。

## 已完成

### BWH 汇报服务和接口

- [x] 从 `BWH_TRAFFIC_API_URL` 和 `BWH_TRAFFIC_WEBHOOK_URL` 读取配置，并使用全局 `fetch` 设置 30 秒超时。
- [x] 校验上游状态、`errcode` 和 `bw_counter_b`、`monthly_bw_limit_b` 数值后，复用百分比、GB 计算和 Markdown 内容。
- [x] 将上游失败转换为可记录且不泄露配置值的错误。
- [x] 在 `.env.example` 增加地址、手动令牌及 `BWH_TRAFFIC_SCHEDULE_ENABLED=false`，不填入真实值。

### 每日调度

- [x] 实现 Asia/Shanghai 下一次 08:00 的延迟计算，并覆盖已过 08:00 和恰好 08:00 的边界。
- [x] 在 Nitro server plugin 中执行汇报、记录失败日志并安排下一次；通过 Nitro `close` hook 清理计时器。
- [x] 使用 Node assert 自检调度函数边界，不新增测试框架或运行时依赖。

## 验证

- [x] 执行 `pnpm build`，确认 Nuxt/Nitro 构建成功。
- [x] 执行调度函数和汇报服务 mock 的 Node assert 自检。
- [x] 检查 `git diff --check`，确认没有空白错误或敏感值进入变更。
