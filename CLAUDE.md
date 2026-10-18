# CLAUDE.md - homepage 项目上下文与开发规范

本仓库是独立的 Nuxt 4 全栈应用，Nuxt 项目根目录就是当前仓库根目录。

## 运行关系

- Nuxt 服务端口：由 `NITRO_PORT` 控制，默认 `3000`
- 当前生产：Tengine 将主入口转发到 homepage `3000` 端口。
- 生产端口由 `.env` 中的 `NITRO_PORT` 和 Tengine 配置共同决定。

## 当前功能

已由 Nuxt 原生处理：

- `/`：`app/pages/index.vue`
- `GET /resume`：`app/pages/resume.vue`
- `POST /resume`：`server/routes/resume.post.ts`
- `/tcloud/mysql/open`：`server/routes/tcloud/mysql/open.get.ts`
- `/tcloud/ecs/open`：`server/routes/tcloud/ecs/open.get.ts`
- `/qrcode`：`server/routes/qrcode.get.ts`
- `/avatar`：`server/routes/avatar.get.ts`、`server/utils/avatar-generator.js`
- `/awareness`：`app/pages/awareness.vue`
- `GET /bwhTraffic/report`：`server/routes/bwhTraffic/report.get.ts`
- `bwhTrafficReport`：`server/plugins/bwh-traffic-schedule.ts`，生产通过环境变量启用，每日 Asia/Shanghai 08:00 执行

## 开发规则

1. Nuxt 页面放在 `app/pages/`，接口放在 `server/routes/`，共享服务端工具放在 `server/utils/`。
2. 保持接口 JSON 协议和状态语义清晰，凭据使用环境变量，不把密钥写入源码。
3. `app/assets/css/main.css` 只放全局无害样式；页面级 body 行为使用 `useHead` 控制。
4. BWH 调度由 `BWH_TRAFFIC_SCHEDULE_ENABLED` 控制；代码和 `.env.example` 默认关闭，生产按实际需要启用。

## 常用命令

```bash
pnpm dev
pnpm build
node .output/server/index.mjs
```

本地直接运行时：复制 `.env.example` 为 `.env`，按环境填写 `NITRO_PORT`、`NITRO_HOST`；腾讯云接口还需要 `TENCENT_*`，BWH 汇报还需要对应的 API、Webhook 和令牌。生产 Docker Compose 容器内部监听 `0.0.0.0`，宿主机端口只绑定 `127.0.0.1`。
