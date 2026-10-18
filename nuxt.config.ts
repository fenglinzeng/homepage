// xEntry 代理目标从环境变量读取，便于本地联调和部署时调整。
const xEntryBackendUrl = (process.env.XENTRY_BACKEND_URL || 'http://127.0.0.1:9999').replace(/\/+$/, '')

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 保持与当前 Node/Nuxt 版本兼容性
  compatibilityDate: '2025-07-15',

  // 开启开发者工具（开发模式下按 Shift + Option + D 唤出）
  devtools: { enabled: true },

  // PostCSS 配置：引入 Autoprefixer 自动化补全浏览器前缀（避免手写 -webkit- 前缀）
  postcss: {
    plugins: {
      autoprefixer: {}
    }
  },

  // 全局样式表引入（只保留基础重置，避免全局样式污染其他页面）
  css: ['~/assets/css/main.css'],

  // 全局 SEO 与 Head 基础设置（继承原 Egg 项目的基础信息）
  app: {
    head: {
      title: '小岛粪成长笔记',
      meta: [
        { charset: 'utf-8' },
        { name: 'renderer', content: 'webkit' },
        { name: 'viewport', content: 'width=640,user-scalable=no' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' },
        {
          name: 'description',
          content: '我叫冯麟增，前端工程师，海南人，毕业于华北科技学院，目前在帝都某十八线互联网公司搬砖。 /*靠代码吃饭，喜欢骑行，爱好摄影 */'
        },
        { name: 'HandheldFriendly', content: 'True' },
        { name: 'baidu-site-verification', content: 'KQZvQlzTAL' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' }
      ],
      link: [
        { rel: 'shortcut icon', href: '/images/icon.png' },
        { rel: 'apple-touch-icon', href: '/images/icon.png' }
      ]
    }
  },

  /**
   * 渐进式平移反向代理规则（绞杀者模式）
   * 
   * 【接手指南】：
   * 1. 凡是尚未迁移至 Nuxt 的老模块，在此处配置 proxy 透传给原 Egg.js 服务；目标由 XENTRY_BACKEND_URL 提供，默认是 127.0.0.1:9999；
   * 2. 当某项业务逻辑（如页面或接口）在 Nuxt 内部重构完毕后，请务必从下方的 routeRules 中【删除对应的代理项】，
   *    让请求由 Nuxt (Nitro) 自身路由处理，以此完成一个模块的彻底解耦。
   * 
   * 当前已原生接管（已从下方代理列表移除）：
   * - / (首页) -> app/pages/index.vue
   * - /resume (简历页及接口) -> app/pages/resume.vue & server/routes/resume.post.ts
   * - /qrcode -> server/routes/qrcode.get.ts
   * - /avatar -> server/routes/avatar.get.ts
   * - /awareness -> app/pages/awareness.vue
   * - /bwhTraffic/report -> server/routes/bwhTraffic/report.get.ts
   * - /tcloud/** (腾讯云防火墙放通接口) -> server/routes/tcloud/**
   */
  routeRules: {
    '/wx/**': { proxy: `${xEntryBackendUrl}/wx/**` },
    '/qiniu/**': { proxy: `${xEntryBackendUrl}/qiniu/**` },
    '/110perf/**': { proxy: `${xEntryBackendUrl}/110perf/**` },
    '/news/**': { proxy: `${xEntryBackendUrl}/news/**` },
    '/api/**': { proxy: `${xEntryBackendUrl}/api/**` }
  }
})
