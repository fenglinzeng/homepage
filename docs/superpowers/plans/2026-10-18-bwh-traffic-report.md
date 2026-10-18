# BWH Traffic Report Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 xEntry 的 BWH 流量汇报接口和每日 08:00 任务迁移到 homepage，同时不修改 xEntry。

**Architecture:** homepage 使用 Nitro 原生路由和 Node 22 全局 `fetch` 完成流量查询及企业微信通知；API 地址和 Webhook 只从环境变量读取。定时任务作为 Nitro server plugin 运行，默认关闭，启用后按 Asia/Shanghai 每日 08:00 调用同一份汇报逻辑。

**Tech Stack:** Nuxt 4、Nitro、TypeScript、Node.js 22、Docker Compose。

**Spec:** 本次对话中已确认的 BWH 迁移方案：保留 `/bwhTraffic/report`，新增环境变量，定时任务默认关闭，xEntry 保持现状。

## Global Constraints

- 不修改 xEntry 仓库和服务器上的 xEntry 服务。
- 不将原 xEntry 中的外部地址、Webhook key 或其他敏感值写入 homepage 源码或 Git。
- 手动触发接口必须通过 `BWH_TRAFFIC_REPORT_TOKEN` 和 `x-bwh-traffic-token` 请求头校验。
- 保留原有的流量字段、百分比/GB 计算和企业微信 Markdown 文案。
- `BWH_TRAFFIC_SCHEDULE_ENABLED` 默认必须为 `false`，避免与 xEntry 现有任务重复发送。
- 生产环境使用单个 homepage 容器；多实例部署会导致定时任务重复执行。

## Review Focus

- 缺少环境变量：接口返回明确失败，日志不暴露敏感值。
- 外部接口非 2xx、超时或返回字段非法：不发送错误通知，并返回失败结果。
- `monthly_bw_limit_b` 为 0 或非数字：避免除零和错误百分比。
- 定时任务关闭时：进程不创建计时器。
- 定时任务启用时：只在 Asia/Shanghai 每日 08:00 执行，并在执行后重新安排下一次。

### Task 1: BWH 汇报服务和接口

**Files:**
- Create: `server/utils/bwh-traffic-report.ts`
- Create: `server/routes/bwhTraffic/report.get.ts`
- Modify: `.env.example`

**Interfaces:**
- `sendBwhTrafficReport(): Promise<{ usagePercent: string; usedGB: string; limitGB: string }>`
- `GET /bwhTraffic/report` 返回原接口的 `success`、`message`、`timestamp` 结构。

- [x] 从 `BWH_TRAFFIC_API_URL` 和 `BWH_TRAFFIC_WEBHOOK_URL` 读取配置，并使用全局 `fetch` 设置 30 秒超时。
- [x] 校验上游状态、`errcode` 和 `bw_counter_b`、`monthly_bw_limit_b` 数值后，复用原有百分比、GB 计算和 Markdown 内容。
- [x] 将上游失败转换为可记录且不泄露配置值的错误；路由成功时返回原成功结构，失败时返回原有 HTTP 200 JSON 失败结构。
- [x] 在 `.env.example` 增加地址、手动令牌及 `BWH_TRAFFIC_SCHEDULE_ENABLED=false`，不填入真实值。

### Task 2: 可控的每日调度

**Files:**
- Create: `server/utils/bwh-traffic-schedule.ts`
- Create: `server/plugins/bwh-traffic-schedule.ts`

**Interfaces:**
- `getMillisecondsUntilNextShanghaiEight(now: Date): number`
- Nitro plugin 仅在 `BWH_TRAFFIC_SCHEDULE_ENABLED=true` 时启动计时器。

- [x] 实现 Asia/Shanghai 下一次 08:00 的延迟计算，并覆盖当前时间已过 08:00 和恰好 08:00 两种边界。
- [x] 在 Nitro server plugin 中执行汇报、记录失败日志并安排下一次；通过 Nitro `close` hook 清理计时器。
- [x] 用 Node 的 assert 自检调度函数边界，不新增测试框架或运行时依赖。

### Task 3: 迁移状态和生产配置文档

**Files:**
- Modify: `nuxt.config.ts`
- Modify: `README.md`
- Modify: `AGENTS.md`

- [x] 将 `/bwhTraffic/report` 从“未接入”更新为 Nuxt 原生路由，并补充服务端文件位置。
- [x] 补充 BWH 环境变量填写、默认关闭调度、启用前必须停用 xEntry 旧调度的说明。
- [x] 说明定时任务适用于当前单容器部署，多实例部署会重复汇报。

### Verification

- [x] 执行 `pnpm build`，确认 Nuxt/Nitro 构建成功。
- [x] 执行调度函数和汇报服务 mock 的 Node assert 自检。
- [x] 检查 `git diff --check`，确认没有空白错误或敏感值进入变更。
