# CLAUDE.md - homepage 项目上下文与开发规范

本仓库是独立的 Nuxt 4 网关与全栈应用，负责逐步承接旧 `xEntry` Egg.js 服务的页面和接口。Nuxt 项目根目录就是当前仓库根目录，不要再使用 `nuxtjs/` 前缀。

## 运行关系

- Nuxt 服务端口：由 `NITRO_PORT` 控制，默认 `3000`
- Egg 源码默认监听：`xEntry/config/config.default.js` 中的 `127.0.0.1:9999`
- 当前 Nuxt `routeRules` 代理目标：由 `XENTRY_BACKEND_URL` 控制，默认 `http://127.0.0.1:9999`

`9999` 是 xEntry 源码默认监听端口。若部署层使用其他端口或域名，在 `.env` 中设置 `XENTRY_BACKEND_URL`；生产构建完成后修改该变量需要重新执行 `pnpm build`。

## 迁移状态

已由 Nuxt 原生处理：

- `/`：`app/pages/index.vue`
- `GET /resume`：`app/pages/resume.vue`
- `POST /resume`：`server/routes/resume.post.ts`
- `/tcloud/mysql/open`：`server/routes/tcloud/mysql/open.get.ts`
- `/tcloud/ecs/open`：`server/routes/tcloud/ecs/open.get.ts`
- `/qrcode`：`server/routes/qrcode.get.ts`
- `/avatar`：`server/routes/avatar.get.ts`、`server/utils/avatar-generator.js`
- `/awareness`：`app/pages/awareness.vue`

当前通过 `routeRules` 代理到 `XENTRY_BACKEND_URL` 指向的 Egg 服务：

`/wx/**`、`/qiniu/**`、`/110perf/**`、`/news/**`、`/api/**`。

旧 Egg 中的 `/n/ghost/**`、`/debug`、`/mail`、`/wb/**`、`/githook/**`、`/weapp-mall/**`、`/jiayouya/**` 等路由当前未配置到 homepage 网关，是否需要纳入迁移范围待确认。

## 迁移规则

1. 先在 `xEntry` 仓库中核对 `app/router.js`、`app/controller/`、`app/service/`、`app/view/`。
2. Nuxt 页面放在 `app/pages/`，根路径接口放在 `server/routes/`，共享服务端工具放在 `server/utils/`。
3. 实现、协议核对和验证全部完成后，才删除 `nuxt.config.ts` 中对应的代理规则。
4. 保持接口 JSON 协议兼容，凭据使用环境变量，不把密钥写入源码。
5. `app/assets/css/main.css` 只放全局无害样式；页面级 body 行为使用 `useHead` 控制。

## 常用命令

```bash
pnpm dev
pnpm build
node .output/server/index.mjs
```

本地配置：复制 `.env.example` 为 `.env`，按环境填写 `NITRO_PORT`、`NITRO_HOST` 和 `XENTRY_BACKEND_URL`。生产环境建议由 PM2、Docker 或 systemd 注入这些变量。
