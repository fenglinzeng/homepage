<template>
  <div :class="['page-container', { off: isOff }]">
    <div class="window">
      <div class="top" id="top" @click="toggleOff">
        <div class="slogan">
          <p>不希望未来</p>
          <p>只有云端之上的天空是蓝的</p>
        </div>
      </div>
      <div class="glass">
        <div class="sky">
          <div class="cloud"></div>
          <div class="cloud"></div>
          <div class="cloud"></div>
          <div class="cloud"></div>
          <div class="cloud"></div>
          <div class="cloud"></div>
          <div class="logo"></div>
        </div>
      </div>
    </div>
    <canvas id="bg" ref="bgCanvas"></canvas>
    <a class="footer" href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
      琼ICP备2021008318号-1
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const isOff = ref(false)
const bgCanvas = ref<HTMLCanvasElement | null>(null)

// 响应式注入 Body 样式类名：离开首页时 Nuxt 会自动卸载此类名，完全杜绝样式污染
useHead({
  bodyAttrs: {
    class: computed(() => (isOff.value ? 'is-home-page off' : 'is-home-page'))
  }
})

const toggleOff = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.nodeName !== 'A') {
    isOff.value = !isOff.value
  }
}

// 粒子背景特效
let cleanupCanvas: (() => void) | null = null

onMounted(() => {
  if (process.client && bgCanvas.value) {
    cleanupCanvas = initParticleCanvas(bgCanvas.value)
  }
})

onBeforeUnmount(() => {
  if (cleanupCanvas) {
    cleanupCanvas()
  }
})

function initParticleCanvas(canvas: HTMLCanvasElement) {
  let animationFrameId: number
  const mousePos = { x: 0, y: 0 }

  const options = {
    directionX: 0,
    directionY: -1,
    velocityX: [0.1, 0.3],
    velocityY: [0.3, 0.7],
    bounceX: true,
    bounceY: false,
    parallax: 0.2,
    pivot: 0,
    density: 9999,
    dotRadius: [1, 5],
    linkColor: '#fff',
    linkDistance: 55,
    linkWidth: 2,
    backgroundColor: '',
    dotColor: ''
  }

  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) return () => {}

  interface Particle {
    x: number
    y: number
    z: number
    r: number
    vx: number
    vy: number
    dx: number
    dy: number
  }

  let particles: Particle[] = []
  let width = 0
  let height = 0

  const onMouseMove = (e: MouseEvent) => {
    mousePos.x = e.pageX - window.innerWidth / 2
    mousePos.y = e.pageY - window.innerHeight / 2
  }

  const onDeviceOrientation = (e: DeviceOrientationEvent) => {
    if (e.gamma !== null && e.beta !== null) {
      mousePos.x = Math.min(Math.max(-e.gamma, -30), 30) * (window.innerWidth / 30)
      mousePos.y = Math.min(Math.max(-e.beta, -30), 30) * (window.innerHeight / 30)
    }
  }

  const refresh = () => {
    width = canvas.width = canvas.offsetWidth
    height = canvas.height = canvas.offsetHeight
    const dotRadius = options.dotRadius
    const numParticles = Math.ceil((width * height) / options.density)

    particles = particles.filter(p => p.x <= width && p.y <= height)

    while (particles.length < numParticles) {
      const z = Math.random()
      particles.push({
        z: (z - options.pivot) / 4,
        r: dotRadius[1] ? z * (dotRadius[1] - dotRadius[0]) + dotRadius[0] : dotRadius[0],
        x: Math.ceil(Math.random() * width),
        y: Math.ceil(Math.random() * height),
        vx: (options.directionX || (Math.random() > 0.5 ? 1 : -1)) * (Math.random() * (options.velocityX[1] - options.velocityX[0]) + options.velocityX[0]),
        vy: (options.directionY || (Math.random() > 0.5 ? 1 : -1)) * (Math.random() * (options.velocityY[1] - options.velocityY[0]) + options.velocityY[0]),
        dx: 0,
        dy: 0
      })
    }
    ctx.strokeStyle = options.linkColor
    ctx.lineWidth = options.linkWidth
  }

  const render = () => {
    ctx.clearRect(0, 0, width, height)
    ctx.beginPath()

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy

      if (options.parallax) {
        const factor = p.z * options.parallax
        p.dx += (mousePos.x * factor - p.dx) / 10
        p.dy += (mousePos.y * factor - p.dy) / 10
      }

      const curX = p.x + p.dx
      const curY = p.y + p.dy

      if (curX < 0 || curX > width) {
        if (options.bounceX) p.vx = -p.vx
        else p.x = (curX + width) % width - p.dx
      }
      if (curY < 0 || curY > height) {
        if (options.bounceY) p.vy = -p.vy
        else p.y = (curY + height) % height - p.dy
      }

      ctx.moveTo(curX + p.r, curY)
      ctx.arc(curX, curY, p.r, 0, 2 * Math.PI)

      for (let j = i - 1; j >= 0; j--) {
        const p2 = particles[j]
        const vx = p2.x - p.x
        const vy = p2.y - p.y
        const dist = Math.sqrt(vx * vx + vy * vy)
        if (dist < options.linkDistance) {
          const x1 = p.x + p.dx
          const y1 = p.y + p.dy
          const x2 = p2.x + p2.dx
          const y2 = p2.y + p2.dy
          const angle = Math.atan2(y2 - y1, x2 - x1)
          const cos = Math.cos(angle)
          const sin = Math.sin(angle)
          ctx.moveTo(x1 + p.r * cos, y1 + p.r * sin)
          ctx.lineTo(x2 - p2.r * cos, y2 - p2.r * sin)
        }
      }
    }

    ctx.stroke()
    animationFrameId = requestAnimationFrame(render)
  }

  window.addEventListener('resize', refresh, false)
  document.addEventListener('mousemove', onMouseMove, false)
  window.addEventListener('deviceorientation', onDeviceOrientation, false)

  refresh()
  render()

  return () => {
    cancelAnimationFrame(animationFrameId)
    window.removeEventListener('resize', refresh)
    document.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('deviceorientation', onDeviceOrientation)
  }
}
</script>

<style scoped>
.page-container {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0;
  overflow: hidden;
  background: #08c;
  transition: 1s all;
  font-family: -apple-system, 'Open Sans', HelveticaNeue-Light, 'Helvetica Neue Light', 'Helvetica Neue',
    'Hiragino Sans GB', 'Microsoft YaHei', Helvetica, Arial, sans-serif;
}

a {
  text-decoration: none;
}

.window {
  padding: 20px;
  border: 4px solid grey;
  border-radius: 48px;
  background-color: #d9d9d9;
  box-shadow: inset 0 0 80px rgba(0, 0, 0, 0.2), 0 0 0 40px #f5f5f5, 0 0 0 44px grey,
    0 20px 40px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 20;
  transition: 1s all;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.window:before {
  content: '';
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  height: 20px;
  background: #000;
  opacity: 0.2;
  filter: blur(10px);
  pointer-events: none;
  z-index: 20;
}

.top {
  position: absolute;
  left: 0;
  top: -90%;
  width: 100%;
  height: 100%;
  border-radius: 48px;
  background: #f5f5f5;
  box-shadow: 0 0 0 4px grey, 0 0 30px rgba(0, 0, 0, 0.4);
  transition: 0.6s all ease-in-out;
  cursor: pointer;
  z-index: 10;
  text-align: center;
  font-size: 12px;
  color: #08c;
}

.top:before {
  content: '';
  display: block;
  width: 40%;
  height: 8px;
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
  background-color: grey;
}

.top:after {
  content: '';
  display: block;
  width: 16px;
  height: 8px;
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
  background-image: radial-gradient(#5df254, #1a0);
  animation-name: light;
  animation-duration: 1s;
  animation-timing-function: ease;
  animation-iteration-count: infinite;
}

.top .slogan {
  position: absolute;
  top: 50%;
  width: 100%;
  line-height: 20px;
  transform: translateY(-50%);
}

.top a {
  color: #08c;
}

.glass {
  position: relative;
  width: 200px;
  height: 300px;
  border-radius: 72px;
  box-shadow: 0 0 0 4px grey;
  overflow: hidden;
}

.glass:after {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-image: radial-gradient(circle farthest-corner at 90% 10%, rgba(255, 255, 255, 0.4) 0, rgba(0, 0, 0, 0) 20%);
  box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.2);
  border-radius: 72px;
}

.sky {
  position: relative;
  background: #3fa9f5;
  width: 100%;
  height: 100%;
  z-index: 0;
  border-radius: 72px;
  overflow: hidden;
}

.logo {
  position: absolute;
  top: 40%;
  width: 60px;
  height: 60px;
  background-image: url(/images/icon.png);
  background-size: contain;
  background-repeat: no-repeat;
  animation-name: leftToRight;
  animation-duration: 5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  z-index: -10;
}

.cloud {
  position: relative;
  width: 100px;
  height: 40px;
  background-color: #fff;
  border-radius: 40px;
  animation-name: leftToRight;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.cloud:after,
.cloud:before {
  content: ' ';
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
}

.cloud:before {
  top: -20px;
  left: 20px;
}

.cloud:after {
  top: -10px;
  left: 50px;
}

.cloud:nth-child(1) {
  animation-duration: 8s;
}

.cloud:nth-child(2) {
  top: 20%;
  animation-duration: 3.5s;
}

.cloud:nth-child(3) {
  top: 40%;
  animation-duration: 5s;
}

.cloud:nth-child(4) {
  top: 60%;
  animation-duration: 6s;
}

.cloud:nth-child(5) {
  top: 20%;
  transform: scale(3);
  animation-duration: 4s;
}

.cloud:nth-child(6) {
  top: 20%;
  transform: scale(2);
  animation-duration: 5.5s;
}

@keyframes leftToRight {
  0% {
    transform: translate(-200%, 0);
  }
  100% {
    transform: translate(350%, 0);
  }
}

@keyframes light {
  0% {
    box-shadow: 0 0 0 #5df254;
  }
  50% {
    box-shadow: 0 0 20px #5df254;
  }
  80% {
    box-shadow: 0 0 40px rgba(93, 242, 84, 0);
  }
}

canvas {
  width: 100%;
  height: 100%;
  transition: 1s all;
}

.footer {
  text-decoration: none;
  position: absolute;
  bottom: 12px;
  left: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 12px;
  opacity: 0.6;
}

/* 夜间模式 */
.page-container.off {
  background: #123;
}

.page-container.off canvas {
  opacity: 0.2;
}

.page-container.off .window {
  opacity: 0.8;
}

.page-container.off .top {
  top: -5%;
}
</style>
