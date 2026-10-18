# homepage：xEntry 到 Nuxt 4 的渐进式迁移

本项目是独立的 Nuxt 4 全栈应用和前置网关，用于逐步承接旧 `xEntry` Egg.js 服务。旧服务位于独立仓库，不是本仓库的 `nuxtjs/` 子目录。

## 一、运行模型

```text
[ 用户客户端 / Nginx 入口 ]
             │
             ▼
      Nuxt 4 网关（NITRO_PORT，默认端口 3000）
    ┌──────────────────────────────────────┐
    │ 已迁移页面和接口：Nuxt / Nitro 原生处理 │
    │ 未迁移模块：按 routeRules 代理到 Egg   │
    └──────────────────────────────────────┘
             │
             ▼
      xEntry Egg.js 服务
      源码默认监听：127.0.0.1:9999
      代理目标：XENTRY_BACKEND_URL（默认 127.0.0.1:9999）
```

`9999` 是 `xEntry/config/config.default.js` 的源码配置。homepage 的 `routeRules` 通过 `XENTRY_BACKEND_URL` 配置代理目标，默认直接指向 `http://127.0.0.1:9999`；如果部署层使用其他端口或域名，应在 `.env` 中调整该变量，不再固定假设 `7001`。

## 二、目录结构

```text
homepage/
├── app/
│   ├── app.vue
│   ├── assets/css/main.css
│   └── pages/
│       ├── index.vue
│       └── resume.vue
├── public/                      # 静态资源，映射到根路径
├── server/
│   ├── data/resume.ts           # 简历结构化数据
│   ├── routes/
│   │   ├── resume.post.ts
│   │   └── tcloud/**
│   └── utils/tencent.ts         # 腾讯云 Lighthouse 封装
├── nuxt.config.ts               # Nuxt、SEO、样式和代理配置
└── package.json
```

## 三、迁移状态

| 模块/路由 | 类型 | 当前状态 | 承接方式 |
| :--- | :--- | :--- | :--- |
| `/` | 页面 | ✅ 已完成 | `app/pages/index.vue` |
| `GET /resume` | 页面 | ✅ 已完成 | `app/pages/resume.vue` |
| `POST /resume` | 接口 | ✅ 已完成 | `server/routes/resume.post.ts` |
| `/tcloud/mysql/open` | 接口 | ✅ 已完成 | Nuxt Nitro 原生路由 |
| `/tcloud/ecs/open` | 接口 | ✅ 已完成 | Nuxt Nitro 原生路由 |
| `/qrcode` | 接口 | ✅ 已完成 | `server/routes/qrcode.get.ts` |
| `/avatar` | 接口 | ✅ 已完成 | `server/routes/avatar.get.ts` |
| `/awareness` | 页面 | ✅ 已完成 | `app/pages/awareness.vue` |
| `/wx/**` | 接口 | ⏳ 代理中 | 微信逻辑仍在 Egg |
| `/qiniu/**` | 页面/接口 | ⏳ 代理中 | 七牛逻辑仍在 Egg |
| `/110perf/**` | 接口 | ⏳ 代理中 | 性能数据仍在 Egg |
| `/news/**` | 页面/接口 | ⏳ 代理中 | 当前只配置了网关代理 |
| `/api/**` | 接口 | ⚠️ 来源待确认 | 当前 Egg 路由文件未发现对应 `/api` 路由 |
| 其他 Egg 路由 | 页面/接口 | ⚠️ 未接入本网关 | `/n/ghost/**`、`/debug`、`/mail`、`/wb/**`、`/githook/**`、`/weapp-mall/**`、`/jiayouya/**`、`/hnxkc`、`/watermark`、`/huangjuan`、`/msg`、`/ip`、`/bwhTraffic/report`、`/aliyun/perf/dpy/` 等 |
| `clearWxDpyToken` | 定时任务 | ⏸ 暂存 Egg | 任务存在，但当前清理调用已注释 |

## 四、继续迁移

1. 在 `xEntry` 仓库中确认原始路由、控制器、服务和模板。
2. 页面放入 `app/pages/`；保持原 URL 的接口放入 `server/routes/`；共享逻辑放入 `server/utils/`。
3. 对照原接口验证方法、参数、返回 JSON 和副作用。
4. 确认新实现可用后，再从 `nuxt.config.ts` 的 `routeRules` 删除对应代理项。
5. 服务端密钥和 Token 只从环境变量读取，不写入仓库。

## 五、开发与构建

在本仓库根目录执行：

```bash
cp .env.example .env
pnpm dev
pnpm build
node .output/server/index.mjs
```

`NITRO_PORT` 控制 homepage 自身端口，`XENTRY_BACKEND_URL` 控制未迁移路由代理到哪个 xEntry 服务。`routeRules` 会在开发启动或生产构建时读取代理地址；生产环境修改代理地址后需重新执行 `pnpm build`。
