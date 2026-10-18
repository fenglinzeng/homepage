# AGENTS.md - homepage 迁移与开发指南

本文件是为接入本项目的 AI Agent（如 Claude、Cursor、Antigravity 等）提供的项目级开发指引。

## 1. 项目全貌与运行模式

- **本项目**：独立的 **Nuxt 4** 网关与全栈应用，仓库根目录就是 Nuxt 项目根目录，不存在 `nuxtjs/` 子目录。
- **原项目**：旧的 **Egg.js 2.x** 服务位于独立的 `xEntry` 仓库，不属于本仓库目录。
- **Nuxt 默认端口**：由 `NITRO_PORT` 控制，未配置时默认使用 `3000`。
- **Egg 源码端口**：`xEntry/config/config.default.js` 当前配置为 `127.0.0.1:9999`。
- **当前代理目标**：本项目 `nuxt.config.ts` 中的 `routeRules` 读取 `XENTRY_BACKEND_URL`，默认指向 `http://127.0.0.1:9999`。如部署层使用其他端口或域名，在 `.env` 中调整该变量；不要把 `7001` 当作 Egg 源码的默认监听端口。
- **配置生效时机**：`routeRules` 在 Nuxt 开发启动或生产构建时读取环境变量；生产环境修改 `XENTRY_BACKEND_URL` 后需重新执行 `pnpm build`。
- **迁移方式**：采用绞杀者模式（Strangler Fig Pattern）。已迁移的页面和接口由 Nuxt 原生处理，仍在 Egg 中的模块通过显式代理转发。

## 2. 当前迁移状态

| 业务模块 / 路由 | 承担者 | 当前状态 | 对应文件或说明 |
| :--- | :--- | :--- | :--- |
| `/` | Nuxt 4 | ✅ 已迁移 | `app/pages/index.vue` |
| `GET /resume` | Nuxt 4 | ✅ 已迁移 | `app/pages/resume.vue` |
| `POST /resume` | Nuxt 4 | ✅ 已迁移 | `server/routes/resume.post.ts` |
| `/tcloud/mysql/open` | Nuxt 4 | ✅ 已迁移 | `server/routes/tcloud/mysql/open.get.ts` |
| `/tcloud/ecs/open` | Nuxt 4 | ✅ 已迁移 | `server/routes/tcloud/ecs/open.get.ts` |
| `/qrcode` | Nuxt 4 | ✅ 已迁移 | `server/routes/qrcode.get.ts`，依赖 `qr-image` |
| `/avatar` | Nuxt 4 | ✅ 已迁移 | `server/routes/avatar.get.ts`、`server/utils/avatar-generator.js` |
| `/awareness` | Nuxt 4 | ✅ 已迁移 | `app/pages/awareness.vue` |
| `/wx/**` | Egg.js | ⏳ 代理中 | 微信校验、消息和登录逻辑仍在 Egg |
| `/qiniu/**` | Egg.js | ⏳ 代理中 | 七牛页面和 Token 逻辑仍在 Egg |
| `/110perf/**` | Egg.js | ⏳ 代理中 | 性能数据接口仍在 Egg |
| `/news/**` | Egg.js | ⏳ 代理中 | 当前只配置了网关代理 |
| `/api/**` | 未确认 | ⚠️ 已配置代理 | 当前 `xEntry/app/router.js` 未发现对应 `/api` 路由，来源和用途待确认 |
| 其他 Egg 路由 | Egg.js | ⚠️ 未接入本网关 | 包括 `/n/ghost/**`、`/debug`、`/mail`、`/wb/**`、`/githook/**`、`/weapp-mall/**`、`/jiayouya/**`、`/hnxkc`、`/watermark`、`/huangjuan`、`/msg`、`/ip`、`/bwhTraffic/report`、`/aliyun/perf/dpy/` 等 |
| `clearWxDpyToken` | Egg.js | ⏸ 暂存 | 任务文件存在，但当前任务体内调用被注释，实际不会清理 Token |

状态以代码为准。文档中的“已迁移”必须同时满足：Nuxt 实现完成、协议兼容、验证通过，并已移除对应代理规则。

## 3. 继续迁移时的工作流

### Step 1：溯源并实现

1. 在独立的 `xEntry` 仓库中查阅原逻辑：
   - 路由：`app/router.js` 和 `app/routers/`
   - 控制器：`app/controller/`
   - 业务逻辑：`app/service/`
   - 页面模板：`app/view/`
2. 在本仓库重构：
   - 页面放在 `app/pages/`，使用 Vue 3 `<script setup>`。
   - 保持原根路径的接口放在 `server/routes/`，例如 `/wx/getConfig` 对应 `server/routes/wx/getConfig.get.ts`。
   - 通用服务端工具放在 `server/utils/`。
   - 返回 JSON 的字段和状态语义必须与原接口兼容。

### Step 2：解除代理

功能在 Nuxt 中实现并验证通过后，才可以从 `nuxt.config.ts` 的 `routeRules` 中删除对应代理项。删除前要确认代理目标、原始路由和 Nuxt 路由三者覆盖范围一致。

### Step 3：样式与工程规范

- 不手写 `-webkit-` 厂商前缀，交给 Autoprefixer。
- `app/assets/css/main.css` 只放全局无害重置。
- 页面专属背景、滚动行为等使用 `useHead({ bodyAttrs: { class: '...' } })` 局部控制。
- 不在迁移过程中复制密钥、Token 或密码；服务端凭据必须通过环境变量注入。

## 4. 常用命令

所有命令均在本仓库根目录执行：

```bash
pnpm dev
pnpm build
node .output/server/index.mjs
```

首次运行可复制 `.env.example` 为 `.env`，再按实际环境填写 `NITRO_PORT` 和 `XENTRY_BACKEND_URL`。`.env` 只保留在本机或部署环境，不提交到仓库。
