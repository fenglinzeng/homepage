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

  // RESS 先提供全局基础重置，项目样式随后补充焦点状态和页面级规则
  css: ['ress/dist/ress.min.css', '~/assets/css/main.css'],

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

})
