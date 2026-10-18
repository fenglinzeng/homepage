# AGENTS.md - homepage 开发指南

本文件用于指导接入本项目的 AI Agent（如 Claude、Cursor、Antigravity 等）。

## 1. 项目全貌与运行模式

- **项目类型**：独立的 **Nuxt 4** 全栈应用，仓库根目录就是 Nuxt 项目根目录。
- **Nuxt 默认端口**：由 `NITRO_PORT` 控制，未配置时默认使用 `3000`。
- **当前生产状态**：homepage 通过 Tengine 入口使用 `NITRO_PORT=3000`。

## 2. 当前功能

| 业务模块 / 路由 | 承担者 | 对应文件或说明 |
| :--- | :--- | :--- |
| `/` | Nuxt 4 | `app/pages/index.vue` |
| `GET /resume` | Nuxt 4 | `app/pages/resume.vue` |
| `POST /resume` | Nuxt 4 | `server/routes/resume.post.ts` |
| `/tcloud/mysql/open` | Nuxt 4 | `server/routes/tcloud/mysql/open.get.ts` |
| `/tcloud/ecs/open` | Nuxt 4 | `server/routes/tcloud/ecs/open.get.ts` |
| `/qrcode` | Nuxt 4 | `server/routes/qrcode.get.ts`，依赖 `qr-image` |
| `/avatar` | Nuxt 4 | `server/routes/avatar.get.ts`、`server/utils/avatar-generator.js` |
| `/awareness` | Nuxt 4 | `app/pages/awareness.vue` |
| `GET /bwhTraffic/report` | Nuxt 4 | `server/routes/bwhTraffic/report.get.ts` |
| `bwhTrafficReport` | Nuxt 4 | `server/plugins/bwh-traffic-schedule.ts`，每日 Asia/Shanghai 08:00 |

## 3. 样式与工程规范

- 不手写 `-webkit-` 厂商前缀，交给 Autoprefixer。
- `app/assets/css/main.css` 只放全局无害重置。
- 页面专属背景、滚动行为等使用 `useHead({ bodyAttrs: { class: '...' } })` 局部控制。
- 服务端凭据必须通过环境变量注入，不提交 `.env`，不把密钥、Token 或密码写入源码。
- BWH 汇报使用 `BWH_TRAFFIC_API_URL`、`BWH_TRAFFIC_WEBHOOK_URL`、`BWH_TRAFFIC_REPORT_TOKEN` 和 `BWH_TRAFFIC_SCHEDULE_ENABLED`；手动接口必须通过 `x-bwh-traffic-token` 校验。
- 代码和 `.env.example` 默认关闭调度，生产按实际需要启用。当前为单容器部署，多实例会造成重复汇报。
- 新增接口放在 `server/routes/`，按 Nitro 文件名约定表达路径和 HTTP 方法；共享服务端逻辑放在 `server/utils/`。

## 4. 常用命令

所有命令均在本仓库根目录执行：

```bash
pnpm dev
pnpm build
node .output/server/index.mjs
```

首次运行可复制 `.env.example` 为 `.env`，再按实际环境填写 `NITRO_HOST`、`NITRO_PORT`；使用腾讯云接口时还需填写 `TENCENT_*`，使用 BWH 汇报时还需填写 `BWH_TRAFFIC_*`。`.env` 只保留在本机或部署环境，不提交到仓库。

生产使用 Docker Compose 部署。修改 `NITRO_PORT` 或其他运行时变量后，重新执行 `bash deploy.sh`，并在修改端口时同步调整 Tengine 配置；Compose 容器内部监听地址固定为 `0.0.0.0`，宿主机只绑定回环地址。
