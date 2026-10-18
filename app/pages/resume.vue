<template>
  <div class="wrap">
    <div class="container">
      <header class="header">
        <div class="skew"></div>
        <div class="logo"></div>
        <div class="header-content">
          <h2 class="greet">冯麟增<span class="cYellow">,</span></h2>
          <h3 class="name">程序员，前端工程师，现居海南海口，2015 年毕业于华北科技学院。/*靠代码吃饭，喜欢骑行，爱好摄影 */</h3>
          <p class="intro">
            7年前端开发经验，包含4年前端架构、3年JAVA开发和2年小组规模项目管理经验。持有PMP项目管理证书，独立和协作完成了多个 Web 前后端和 APP 项目，对主导项目从0到1的搭建、架构设计、版本迭代、优化与重构等均有实操经验。编程基础扎实，有基本的交互设计经验，熟悉面向对象和模块化编程思想，遵循主流编码规范，对性能优化有一定的经验，熟悉工程化协作流，有Linux部署运维经验。主观能动性交强，服务意识较好，对技术有热情，工作细心负责，有良好的问题分析和解决能力。
          </p>
          <ul class="info">
            <li class="info-item">
              <i class="iconfont icon-code"></i>
              <div class="info-text ib vm">https://brofen.cn</div>
            </li>
            <li class="info-item">
              <i class="iconfont icon-github"></i>
              <div class="info-text ib vm">https://github.com/fenglinzeng</div>
            </li>
            <li class="info-item">
              <i class="iconfont icon-weibo"></i>
              <div class="info-text ib vm">https://weibo.com/thisisxxx</div>
            </li>
            <li class="info-item">
              <i class="iconfont icon-mail"></i>
              <div class="info-text ib vm">fenglinzeng@gmail.com</div>
            </li>
            <li class="info-item">
              <i class="iconfont icon-phone"></i>
              <div class="info-text ib vm">17600119277</div>
            </li>
          </ul>
        </div>
      </header>

      <main class="main clearfix">
        <div class="flex">
          <div class="block skill">
            <h3 class="block-title">技能储备</h3>
            <ul class="block-list">
              <li class="timeline skill-hover">
                <div class="item-subtitle">ESNext / Sea.js / Vue.js</div>
                <div class="item-progress">
                  <div class="item-progress__light" style="width: 80%;">
                    <span class="item-progress__digit">80%</span>
                  </div>
                </div>
              </li>
              <li class="timeline skill-hover">
                <div class="item-subtitle">CSS / CSS3 / SCSS</div>
                <div class="item-progress">
                  <div class="item-progress__light" style="width: 80%;">
                    <span class="item-progress__digit">80%</span>
                  </div>
                </div>
              </li>
              <li class="timeline skill-hover">
                <div class="item-subtitle">Node.js / Egg.js</div>
                <div class="item-progress">
                  <div class="item-progress__light" style="width: 70%;">
                    <span class="item-progress__digit">70%</span>
                  </div>
                </div>
              </li>
              <li class="timeline skill-hover">
                <div class="item-subtitle">Java / Spring Cloud</div>
                <div class="item-progress">
                  <div class="item-progress__light" style="width: 70%;">
                    <span class="item-progress__digit">70%</span>
                  </div>
                </div>
              </li>
              <li class="timeline skill-hover">
                <div class="item-subtitle">MacOS / CentOS</div>
                <div class="item-progress">
                  <div class="item-progress__light" style="width: 70%;">
                    <span class="item-progress__digit">70%</span>
                  </div>
                </div>
              </li>
              <li class="timeline skill-hover">
                <div class="item-subtitle">PMP 项目管理 / 研发管理</div>
                <div class="item-progress">
                  <div class="item-progress__light" style="width: 70%;">
                    <span class="item-progress__digit">70%</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="block flex-item job">
            <h3 class="block-title">工作经历</h3>
            <ul class="block-list">
              <li class="timeline grid-item flex">
                <div
                  class="grid-logo"
                  style="background-image: url('/images/dongpinyun.png');"
                ></div>
                <div class="item-block flex-item">
                  <p class="job-name">
                    海南冻品云供应链科技有限公司
                    <span class="job-position">研发经理</span>
                  </p>
                  <p class="job-duration">2018-06 - 至今</p>
                  <div class="job-intro">
                    <p>1、承担前端技术选型工作，设计和搭建前端架构，建立编码规范，完善前端工程化体系建设；</p>
                    <p>2、在多个项目中落地自己封装的脚手架，在部门内部推行ESLint，CommitLint，结合 Code Review 保障代码质量；</p>
                    <p>3、前期主导了商城 ERP 系统的前后端分离改造的前端部分。后期参与 JAVA 开发，经历多次重构，参与将整个商城系统从单体向微服务进行改造；</p>
                    <p>4、把控多个内部系统前后端的质量和进度，推崇敏捷开发，提倡多尝试实践新技术；</p>
                    <p>5、推动 Node.js 在技术部门的应用，一些报表和数据可视化的简单需求，通过 Node.js 由前端快速实现；</p>
                    <p>6、负责本地测试服务器和生产云服务器的搭建运维工作，通过Jenkins和云效流水线实现快速部署，通过负载均衡和服务监控保障生产服务高可用；</p>
                  </div>
                </div>
              </li>
              <li class="timeline grid-item flex">
                <div
                  class="grid-logo"
                  style="background-image: url('/images/soufun.png');"
                ></div>
                <div class="item-block flex-item">
                  <p class="job-name">
                    房天下
                    <span class="job-position">前端工程师</span>
                  </p>
                  <p class="job-duration">2016-04 - 2018-06</p>
                  <div class="job-intro">
                    <p>0、负责专题活动页面的开发（jQuery, Canvas）；</p>
                    <p>1、参与 m 站功能模块及常用组件开发（jQuery, Sea.js）；</p>
                    <p>2、参与 PC 站二手房详情页前端架构设计和重构（jQuery, Sea.js）；</p>
                    <p>3、参与 m 站自动化构建及部署设计（Gulp）；</p>
                    <p>4、内部数据可视化及相关内部管理系统的开发（Vue.js, Node.js）；</p>
                    <p>5、房天下新媒体工具开发（Chrome 浏览器插件）；</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="block case">
          <h3 class="block-title">项目案例</h3>
          <ul class="block-list">
            <li class="block-item timeline flex">
              <div class="item-info flex-item">
                <div class="item-title">
                  冻品云商城 ERP 系统
                  <span class="item-job">前端开发、后端开发</span>
                  <span class="date-end">2018-06 - 至今</span>
                </div>
                <div class="item-subtitle dot">项目内容</div>
                <div class="item-intro">
                  <p>0、前端技术栈：Vue.js + Vue-Router + Vuex + Element-UI，后端技术栈：Spring Cloud Alibaba；</p>
                  <p>1、主导了前后端分离的前端工作，承担项目选型和搭建工作；</p>
                  <p>2、通过懒加载、合并请求、页面缓存等优化方式提升交互性能；</p>
                  <p>3、通过借鉴表驱动法、组件封装等方式优化代码结构；</p>
                  <p>4、通过 Eslint + CommitLint 等工具保障代码风格；</p>
                  <p>5、通过 Jenkins 和云效流水线等服务实现项目的一键部署；</p>
                  <p>6、通过 Sentry 监控前端未知错误；</p>
                </div>
                <div class="item-subtitle dot">项目业绩</div>
                <div class="item-intro">
                  该系统是围绕冻品云商城的信息维护、采购、下单、运营、人员管理、工作流审批等业务功能开发的系统，目前系统已有100多个页面，通过一系列优化方式，确保系统在网络畅通的情况下首次加载能在1秒内完成前端页面资源加载，2秒左右完成界面渲染并展示。通过前端组件缓存的方式，减少了页面切换的渲染消耗，提升交互性能和体验。通过封装地图、通讯录、图片视频素材管理、图表等10多个组件和工具类，提升代码的可复用性和可维护性。
                </div>
              </div>
            </li>

            <li class="block-item timeline flex">
              <div class="item-info flex-item">
                <div class="item-title">
                  冻品云数据中心
                  <span class="item-job">项目负责人、前后端开发</span>
                  <span class="date-end">2020-05 - 至今</span>
                </div>
                <div class="item-subtitle dot">项目内容</div>
                <div class="item-intro">
                  <p>0、技术栈：Vue 全家桶 + ElementUI + Spring Cloud Alibaba + CDH + Egg.js</p>
                  <p>1、前端 APP 和小程序使用神策的 SDK 采集用户的点击和页面访问数据给到后端</p>
                  <p>2、后端 JAVA 接收后先存到 Kafka 里，再由 JAVA 进行消费，先将原始数据存入HDFS，同时将需要的数据字段清洗后存到 Impala 对应的业务表和宽表里。</p>
                  <p>3、前端根据业务和运营需要，通过后端 JAVA 访问 Impala 数据库进行对应数据的查询，将查询到的数据以图表和表格形式展示在页面，方便相关运营和销售部门做分析和决策</p>
                  <p>4、一些简单的定时数据报表，通过 Egg.js 查询数据库生成 Excel 通过企业微信群机器人发送到指定的企业微信群</p>
                </div>
                <div class="item-subtitle dot">项目业绩</div>
                <div class="item-intro">
                  这个数据系统提供的数据为商城运营了理性的数据支持，方便各门店和业务部门主管查看商城相关经营数据，掌握定期销售情况，方面运营部门推出针对性的营销计划
                </div>
              </div>
            </li>

            <li class="block-item timeline flex">
              <div class="item-info flex-item">
                <div class="item-title">
                  冻品云商城小程序
                  <span class="item-job">前端开发，后端开发</span>
                  <span class="date-end">2018-08 - 至今</span>
                </div>
                <div class="item-subtitle dot">项目内容</div>
                <div class="item-intro">
                  <p>1、承担小程序项目搭建和开发工作；</p>
                  <p>2、将常用的模块和功能封装成组件，便于需求变更时快速维护；</p>
                  <p>3、对小程序进行分包，减小首包体积，加快首次加载速度；</p>
                </div>
                <div class="item-subtitle dot">项目业绩</div>
                <div class="item-intro">
                  冻品云商城小程序是提供给商城用户使用的小程序，和商城APP有同样的功能，方便用户在不下载APP时，快速通过小程序进行商品浏览、商品收藏、下单等、退货等操作。初版小程序由原生微信小程序进行开发，后使用UniAPP进行重构，新版本目前正在内测中。
                </div>
              </div>
            </li>

            <li class="block-item timeline flex">
              <div class="item-info flex-item">
                <div class="item-title">
                  冻品云客服聊天系统
                  <span class="item-job">项目负责人、前后端开发</span>
                  <span class="date-end">2019-06 - 2019-07</span>
                </div>
                <div class="item-subtitle dot">项目内容</div>
                <div class="item-intro">
                  <p>0、技术栈：Vue.js + VantUI + Socket.io + Egg.js；</p>
                  <p>1、从0到1完成完成项目，调研技术可行性，负责技术选型，完成功能需求；</p>
                  <p>2、客户侧由 APP 和小程序通过 Webview 的形式访问，根据用户所在门店分配在线客服，支持文字、图片、短视频消息的发送，支持查询订单发送订单卡片消息给客服进行咨询；</p>
                  <p>3、客服侧是客服人员从 PC 端访问，左侧是咨询客户列表，中间是聊天界面，右侧是客户基本信息和订单信息。同样支持文字、图片、短视频，以及粘贴图片时自动上传发送，和消息撤回功能。；</p>
                  <p>4、引入 AliNode 服务监控服务性能；</p>
                </div>
                <div class="item-subtitle dot">项目业绩</div>
                <div class="item-intro">
                  在原来只有电话客服的基础上，增加了在线客服功能，方便客户在电话客服下班以后的时间里，可以通过图片和短视频的方式给客服留言。在客服上班的时间里，客户也可以实时与客服进行在线沟通，一定程度上降低了客户与客服的沟通成本。
                </div>
              </div>
            </li>

            <li class="block-item timeline flex">
              <div class="item-info flex-item">
                <a href="http://data.fang.com/" target="_blank" rel="noopener noreferrer" class="fix-btn">
                  <i class="iconfont icon-link"></i>
                </a>
                <div class="item-title">
                  房天下平台数据中心
                  <span class="item-job">前端开发、Node.js开发</span>
                  <span class="date-end">2017-04 - 2018-06</span>
                </div>
                <div class="item-subtitle dot">项目内容</div>
                <div class="item-intro">
                  <p>0、公司内部项目。一期「数据工作台」于2017年3月立项，主要展示各业务线的具体流量数据和各项业务指标的总体情况，以及定时给领导发送各个大区、省、市的数据流量日、周、月报告。二期立项于2017年10月，做了流量数据的下钻，可以详细展示具体某个城市、某个楼盘、某一时段的数据，同时接入和重构了部分 BI 系统的业务（项目合并，数据工作台更名平台数据中心）。三期立项于2018年1月，接入了公司其它云端业务的数据，进一步接入权限控制，同时支持以 iframe 适配给外部页面引用。目前主要是陆陆续续接入各种业务的数据查询需求；</p>
                  <p>1、项目分配了4个人，将需求根据大家的工作饱和度均分，大家负责各自 Vue.js 前端界面开发和 Node.js 中转大数据接口；</p>
                  <p>2、Vue.js 在一期时做成多页应用，页面 HTML 由 Node.js 控制输出，城市和用户管理一个单页，流量数据一个单页；</p>
                  <p>3、Node.js 中转接口使用 Express 框架，主要管理不同权限浏览不同页面，在 footer 分别输出不同的配置信息，以及数据接口的鉴权；</p>
                  <p>4、流量报告因为涉及到多个推广渠道、应用渠道和大区、城市，一个报告页面数据需要调集接近一百个原始接口，评估后决定由 Node.js 定时调取接口数据进行处理后生成 HTML 静态页，再由 Node.js 调用指定邮箱发送邮件给报告收件人；</p>
                  <p>5、二期改成了多页应用，前后端均加入视图鉴权。同时打平了路由，使得系统的拓展性更好；</p>
                  <p>6、由于原始接口不稳定，前期在 Node.js 层加入了 Node-Cache，后期改为 Redis。同时通过脚本将部分接口数据落地本地 MySQL 数据库，提升接口速度和灵活性；</p>
                  <p>7、三期加入了更为细致的权限管理，同时适配样式和接口，支持通过约定的方式从外部 iframe 访问页面；</p>
                </div>
                <div class="item-subtitle dot">项目业绩</div>
                <div class="item-intro">
                  于个人和团队来说，尝试了多页 MVVM 的可行性，也明白了没有最好的方案，只有合适的方案。于公司来说，用产品的话说这是公司这么多年来第一次做集团公司层面的流量数据的整理和展示，调集了研究院和大数据部门的协作，算是史无前例的一个项目。
                </div>
              </div>
            </li>

            <li class="block-item timeline flex">
              <div class="item-info flex-item">
                <a href="https://esf.fang.com/" target="_blank" rel="noopener noreferrer" class="fix-btn">
                  <i class="iconfont icon-link"></i>
                </a>
                <div class="item-title">
                  PC二手房详情页重构
                  <span class="item-job">前端开发</span>
                  <span class="date-end">2017-05 - 2017-06</span>
                </div>
                <div class="item-subtitle dot">项目内容</div>
                <div class="item-intro">
                  <p>0、协助 PC 二手房部门重构详情页，主要参与前端开发</p>
                  <p>1、PC 部门没有前端，之前的工作流程是设计部门直接出设计和切图，PC 部门的后端同事（.net）直接套页面和写JS，由于 JS 水平参差不齐和历史包袱等原因，二手房详情页的页面体验不理想。</p>
                  <p>2、综合 Sea.js 和 r.js，封装了一套 FangFIS 构建工具，可以使用 ES6 的语法配合 Sea.js 进行开发，上线前可以用 FangFIS 进行依赖分析并合并打包处理，再结合服务器端的 Combo，尽量实现依赖模块的前置并行加载和按需异步加载。</p>
                  <p>3、重构版本测试稳定后，向领导提议用 HTML5 替换 Flash 播放视频，并定制开发了详情页视频看房的 HTML5 视频播放器 XPlayer，刚好在 Adobe 正式公告未来将停更 Flash 前加入了优先 HTML5 视频播放的行列。（当时的 Flash 播放器在 onload 之后才初始化，非常影响视频看房详情页的首屏加载体验，而 HTML5 播放器则几乎与首屏同时完成初始化）</p>
                </div>
                <div class="item-subtitle dot">项目业绩</div>
                <div class="item-intro">
                  上线后，根据博睿监测的数据，页面整体性能从11秒降低到2秒，首屏时间在900毫秒左右。FangFIS 和 XPlayer 在平台技术部内推广使用。
                </div>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </div>
    <footer class="footer">小岛粪成长笔记 © 2014-2018</footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

useHead({
  title: '简历 - 冯麟增 - 前端工程师',
  meta: [
    { name: 'HandheldFriendly', content: 'True' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' }
  ]
})

onMounted(() => {
  if (process.client) {
    // 百度统计
    const hm = document.createElement('script')
    hm.src = 'https://hm.baidu.com/hm.js?f014717020cd56db0fac821912aa7c7d'
    const s = document.getElementsByTagName('script')[0]
    if (s && s.parentNode) {
      s.parentNode.insertBefore(hm, s)
    }
  }
})
</script>

<style scoped src="~/assets/css/resume.css"></style>
