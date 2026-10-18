# homepage：Nuxt 4 全栈应用

本项目是基于 Nuxt 4 的全栈应用，使用 Nuxt 页面、Nitro 服务端路由和 Docker Compose 运行。

## 一、运行模型

```text
[ 用户客户端 / Tengine 入口 ]
             │
             ▼
      Nuxt 4 应用（NITRO_PORT，默认端口 3000）
    ┌──────────────────────────────────────┐
    │ 页面：Nuxt 页面原生处理                │
    │ 接口：Nitro 服务端路由原生处理         │
    └──────────────────────────────────────┘
```

当前生产环境由 Tengine 将主入口转发到 homepage 的 `3000` 端口。

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
│   │   ├── bwhTraffic/report.get.ts
│   │   └── tcloud/**
│   ├── utils/
│   │   ├── bwh-traffic-report.ts
│   │   ├── bwh-traffic-schedule.ts
│   │   └── tencent.ts            # 腾讯云 Lighthouse 封装
│   └── plugins/bwh-traffic-schedule.ts
├── nuxt.config.ts               # Nuxt、SEO 和样式配置
├── Dockerfile                   # 生产镜像构建
├── docker-compose.yml           # 生产容器编排
├── deploy.sh                    # 生产部署入口
└── package.json
```

## 三、当前功能

| 路由或任务 | 类型 | 实现位置 |
| :--- | :--- | :--- |
| `/` | 页面 | `app/pages/index.vue` |
| `GET /resume` | 页面 | `app/pages/resume.vue` |
| `POST /resume` | 接口 | `server/routes/resume.post.ts` |
| `/tcloud/mysql/open` | 接口 | `server/routes/tcloud/mysql/open.get.ts` |
| `/tcloud/ecs/open` | 接口 | `server/routes/tcloud/ecs/open.get.ts` |
| `/qrcode` | 接口 | `server/routes/qrcode.get.ts` |
| `/avatar` | 接口 | `server/routes/avatar.get.ts`、`server/utils/avatar-generator.js` |
| `/awareness` | 页面 | `app/pages/awareness.vue` |
| `GET /bwhTraffic/report` | 接口 | `server/routes/bwhTraffic/report.get.ts` |
| `bwhTrafficReport` | 定时任务 | `server/plugins/bwh-traffic-schedule.ts`，每日 Asia/Shanghai 08:00 |

新增服务端接口放在 `server/routes/`，按 Nitro 文件名约定表达 HTTP 方法；共享逻辑放在 `server/utils/`。服务端密钥和 Token 只从环境变量读取，不写入仓库。

## 四、开发与构建

在本仓库根目录执行：

```bash
cp .env.example .env
pnpm dev
pnpm build
node .output/server/index.mjs
```

本地直接运行时，`NITRO_HOST` 和 `NITRO_PORT` 控制 homepage 服务监听地址和端口。生产 Compose 会让容器监听 `0.0.0.0`，但只将宿主机端口绑定到 `127.0.0.1`，由 Tengine 对外提供服务。

BWH 汇报配置使用 `BWH_TRAFFIC_API_URL`、`BWH_TRAFFIC_WEBHOOK_URL` 和手动接口令牌 `BWH_TRAFFIC_REPORT_TOKEN`，只在本机或生产服务器的 `.env` 中填写。手动调用时通过 `x-bwh-traffic-token` 请求头传入令牌。`BWH_TRAFFIC_SCHEDULE_ENABLED` 在代码和 `.env.example` 中默认是 `false`；生产按实际调度需要设置为 `true`。本地开发通常保持 `false`，避免本地实例发送真实汇报。

## 五、Docker Compose 生产部署

Compose 只管理 homepage。容器端口通过 `.env` 中的 `NITRO_PORT` 配置，并只绑定到宿主机 `127.0.0.1`，由 Tengine 转发对外提供服务。

首次部署：

```bash
cp .env.example .env
chmod 600 .env
# 按生产环境填写 .env，至少确认 NITRO_HOST、NITRO_PORT；如使用腾讯云接口，还需填写 TENCENT_*；如使用 BWH 汇报，还需填写 BWH_TRAFFIC_API_URL、BWH_TRAFFIC_WEBHOOK_URL 和 BWH_TRAFFIC_REPORT_TOKEN
bash deploy.sh
```

后续更新：

```bash
git pull --ff-only origin main
bash deploy.sh
```

`deploy.sh` 会校验 Compose 配置、构建 Linux 生产镜像并以 `unless-stopped` 策略启动 homepage。查看状态和日志：

```bash
docker compose ps
docker compose logs -f homepage
```

生产环境不要把 `.env` 提交到 Git。修改 `NITRO_PORT` 后需要同步调整 Tengine upstream 端口，再执行 `bash deploy.sh`。

当前部署为单个 homepage 容器。BWH 定时任务启用后由 homepage 进程执行，多实例部署会造成重复汇报。
