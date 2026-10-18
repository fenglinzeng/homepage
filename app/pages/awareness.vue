<template>
  <main class="awareness-page" @pointerdown.prevent="showValue">
    <h1>随便点点</h1>
    <span
      v-for="item in effects"
      :key="item.id"
      class="socialist-value"
      :style="{ left: `${item.left}px`, top: `${item.top}px` }"
    >
      {{ item.text }}
    </span>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const coreSocialistValues = ['富强', '民主', '文明', '和谐', '自由', '平等', '公正', '法治', '爱国', '敬业', '诚信', '友善']
const effects = ref<Array<{ id: number; text: string; left: number; top: number }>>([])
let nextId = 0

useHead({
  title: '觉悟',
  bodyAttrs: {
    class: 'awareness-page-body',
  },
})

function showValue(event: PointerEvent) {
  const id = nextId++
  const text = coreSocialistValues[Math.floor(Math.random() * coreSocialistValues.length)]
  const item = {
    id,
    text,
    left: event.clientX,
    top: event.clientY - 20,
  }

  effects.value.push(item)
  window.setTimeout(() => {
    effects.value = effects.value.filter((effect) => effect.id !== id)
  }, 1500)
}
</script>

<style scoped>
:global(body.awareness-page-body) {
  overflow: hidden;
}

.awareness-page {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100dvh;
  overflow: hidden;
  touch-action: none;
}

h1 {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0;
  color: #999;
  font-size: 13px;
  font-weight: normal;
  transform: translate(-50%, -50%);
}

.socialist-value {
  position: fixed;
  z-index: 1;
  color: #ff6651;
  font-weight: normal;
  pointer-events: none;
  animation: float-away 1.5s ease-out forwards;
}

@keyframes float-away {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(-160px);
  }
}
</style>
