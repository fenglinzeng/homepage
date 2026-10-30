<script setup>
import { computed, onMounted, ref } from 'vue'
import aboutData from '../data/about-data.js'

const route = useRoute()
const dark = ref(false)
const model = computed(() => aboutData.models.find(item => item.id === route.query.model) || aboutData.models[0])
const introMeta = computed(() => aboutData.profile.introMeta.split('·').map(item => item.trim()).filter(Boolean))
const draft = aboutData.myDraft

useHead({
  title: '关于我 | 冯麟增的冯言疯语',
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  bodyAttrs: { class: 'is-about-page' }
})

onMounted(() => {
  dark.value = localStorage.getItem('about-theme') === 'dark'
})

function toggleTheme() {
  dark.value = !dark.value
  localStorage.setItem('about-theme', dark.value ? 'dark' : 'light')
}
</script>

<template>
  <div class="about-page" :class="{ dark }">
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="#top" aria-label="返回顶部"><img class="brand-mark" src="/images/icon.png" alt=""><span>{{ aboutData.profile.shortName }}</span><small>About</small></a>
        <nav class="header-nav" aria-label="页面板块导航">
          <a v-for="item in aboutData.profile.navigation" :key="item.target" :href="item.target">{{ item.label }}</a>
        </nav>
        <div class="header-actions">
          <button class="icon-button" type="button" :aria-label="dark ? '切换浅色模式' : '切换深色模式'" @click="toggleTheme">
            <span class="theme-icon">
              <svg v-if="dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
            </span>
          </button>
        </div>
      </div>
    </header>

    <main id="top" class="page-shell">
      <div class="content-stack">
        <section class="card hero-card">
          <div class="hero-meta">
            <span class="ai-generated"><span class="generated-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /><path d="M20 2v4M22 4h-4" /><circle cx="4" cy="20" r="2" /></svg></span><span>{{ introMeta[0] || 'AI Generated' }}</span></span>
            <span>|</span><span>{{ model.label }} by {{ model.provider }}</span><span>·</span><span>{{ introMeta.slice(1).join(' · ') }}</span>
          </div>
          <div class="hero-title-row">
            <h1>AI 视角下的他</h1>
            <div class="profile-links">
              <a v-for="link in aboutData.profile.links" :key="link.label" :href="link.href" :aria-label="link.label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></a>
            </div>
          </div>
          <div class="hero-intro"><p v-for="(paragraph, index) in draft.intro" :key="index">{{ paragraph }}</p></div>
        </section>

        <div class="tag-row"><span v-for="tag in draft.tags" :key="tag" class="tag">{{ tag }}</span></div>

        <section id="quote" class="quote-card">
          <div class="quote-label"><span class="quote-model-icon"><svg viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 0 0-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 0 1 .476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 0 1 4.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 0 1-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 0 0 5.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0 0 10.205 0a5.947 5.947 0 0 0-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 0 0 4.162 1.713z"></path></svg></span><span>{{ model.label }} 的私心话</span></div>
          <h2>{{ model.observation }}</h2><p>{{ model.sourceExcerpt }}</p>
        </section>

        <section id="patterns" class="card section-card">
          <div class="section-heading"><h2>如果你认识他</h2><p>跟他相处久了，你大概会注意到这些</p></div>
          <div class="pattern-list"><article v-for="item in draft.patterns" :key="item.title" class="pattern-item"><div class="pattern-head"><span class="pattern-dot" aria-hidden="true" /><h3>{{ item.title }}</h3></div><p>{{ item.body }}</p></article></div>
        </section>
        <section id="sides" class="card section-card">
          <div class="section-heading"><h2>他的不同面</h2><p>不只是写代码的人</p></div>
          <div class="side-grid"><article v-for="item in draft.sides" :key="item.title" class="side-item"><h3><span>{{ item.emoji }}</span>{{ item.title }}</h3><p>{{ item.body }}</p><a class="more-link" href="#works">了解更多 ↗</a></article></div>
        </section>
        <section id="timeline" class="card section-card">
          <div class="section-heading"><h2>这些年我在忙什么</h2><p>按内容的阶段变化划分，不是简历</p></div>
          <ol class="timeline-list"><li v-for="item in draft.timeline" :key="item.period" class="timeline-item"><span class="timeline-marker" aria-hidden="true" /><div class="timeline-head"><span class="timeline-period">{{ item.period }}</span><h3>{{ item.title }}</h3></div><p>{{ item.body }}</p></li></ol>
        </section>
        <section id="audience" class="card section-card">
          <div class="section-heading"><h2>换个身份看他</h2><p>你是谁，决定了你从哪部分内容认识我</p></div>
          <div class="audience-grid"><article v-for="item in draft.audience" :key="item.title" class="audience-item"><h3><span>{{ item.emoji }}</span>{{ item.title }}</h3><p>{{ item.body }}</p></article></div>
        </section>
        <section id="philosophy" class="card section-card">
          <div class="section-heading"><h2>做事哲学</h2><p>从做过的事里，能看到这些模式</p></div>
          <div class="philosophy-list"><article v-for="item in draft.philosophy" :key="item.title" class="philosophy-item"><h3>{{ item.title }}</h3><ul><li v-for="line in item.items" :key="line"><span class="philosophy-dot" aria-hidden="true" /><span>{{ line }}</span></li></ul></article></div>
        </section>
        <section id="works" class="card section-card">
          <div class="section-heading"><h2>代表文章</h2><p>内容加载中</p></div>
          <div class="work-list"><article v-for="n in 5" :key="n" class="skeleton-article" aria-hidden="true"><span class="skeleton-block skeleton-cover" /><span class="skeleton-article-body"><span class="skeleton-block skeleton-line title" /><span class="skeleton-block skeleton-line summary" /><span class="skeleton-block skeleton-line date" /></span></article></div>
        </section>
        <section id="social" class="card section-card">
          <div class="section-heading"><h2>社媒动态</h2><p>内容加载中</p></div>
          <div class="social-list"><article v-for="n in 5" :key="n" class="skeleton-feed-item" aria-hidden="true"><span class="skeleton-feed-body"><span class="skeleton-block skeleton-line title" /><span class="skeleton-block skeleton-line summary" /><span class="skeleton-block skeleton-line date" /></span></article></div>
        </section>
        <section id="github" class="card section-card">
          <div class="section-heading"><h2>GitHub 项目</h2><p>内容加载中</p></div>
          <div class="github-list"><article v-for="n in 5" :key="n" class="skeleton-project-item" aria-hidden="true"><span class="skeleton-project-body"><span class="skeleton-block skeleton-line title" /><span class="skeleton-block skeleton-line summary" /></span></article></div>
        </section>
        <section id="contact" class="card section-card">
          <div class="section-heading"><h2>跟我聊什么最来劲</h2><p>AI 从我的公开记录里挑的，真人和 AI 分身都接得住</p></div>
          <ol class="chat-list"><li v-for="topic in draft.chatTopics" :key="topic">{{ topic }}</li></ol>
        </section>
        <section class="disclaimer">
          <p>本页由 AI（GPT-6）基于冯麟增的博客文章、社媒动态、GitHub 项目和公开履历生成，只反映公开内容里能观察到的部分，难免有偏差和遗漏，一切以他的原文为准。</p>
          <p>更新于 2026年8月17日 12:30·GPT-6 by OpenAI·来源 博客 / 微博 / 小红书 / Github</p>
          <p>若你希望了解更完整的第一手内容，可直接查看<a class="blog-link" href="https://brofen.cn/">博客</a>。</p>
        </section>
      </div>
    </main>
    <footer class="site-footer">
      © 2026 brofen.cn · <a href="https://beian.miit.gov.cn/">琼ICP备2021008318号-1</a>
    </footer>
  </div>
</template>

<style scoped src="../assets/css/about.css"></style>
