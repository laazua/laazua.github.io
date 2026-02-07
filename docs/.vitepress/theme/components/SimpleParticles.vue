// .vitepress/theme/components/SimpleParticles.vue
<template>
  <canvas ref="canvas" class="particles-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx = null
let particles = []
let animationId = null
let mouse = { x: null, y: null, radius: 100 }

function initParticles() {
  if (!canvas.value) return
  
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.value.getBoundingClientRect()
  
  canvas.value.width = rect.width * dpr
  canvas.value.height = rect.height * dpr
  canvas.value.style.width = `${rect.width}px`
  canvas.value.style.height = `${rect.height}px`
  
  ctx = canvas.value.getContext('2d')
  ctx.scale(dpr, dpr)
  
  // 创建粒子
  particles = []
  const particleCount = Math.min(100, (rect.width * rect.height) / 10000)
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1 - 0.5,
      color: `rgba(62, 175, 124, ${Math.random() * 0.5 + 0.3})`
    })
  }
  
  animate()
}

function animate() {
  if (!ctx || !canvas.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  
  // 清空画布
  ctx.clearRect(0, 0, rect.width, rect.height)
  
  // 更新和绘制粒子
  particles.forEach(particle => {
    // 移动粒子
    particle.x += particle.speedX
    particle.y += particle.speedY
    
    // 边界检查
    if (particle.x > rect.width) particle.x = 0
    if (particle.x < 0) particle.x = rect.width
    if (particle.y > rect.height) particle.y = 0
    if (particle.y < 0) particle.y = rect.height
    
    // 鼠标互动
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - particle.x
      const dy = mouse.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < mouse.radius) {
        const angle = Math.atan2(dy, dx)
        const force = (mouse.radius - distance) / mouse.radius
        particle.x -= Math.cos(angle) * force * 5
        particle.y -= Math.sin(angle) * force * 5
      }
    }
    
    // 绘制粒子
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fillStyle = particle.color
    ctx.fill()
    
    // 绘制连线
    particles.forEach(otherParticle => {
      const dx = particle.x - otherParticle.x
      const dy = particle.y - otherParticle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 100) {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(62, 175, 124, ${0.2 * (1 - distance / 100)})`
        ctx.lineWidth = 0.5
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(otherParticle.x, otherParticle.y)
        ctx.stroke()
      }
    })
  })
  
  animationId = requestAnimationFrame(animate)
}

function handleMouseMove(e) {
  const rect = canvas.value.getBoundingClientRect()
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
}

function handleMouseLeave() {
  mouse.x = null
  mouse.y = null
}

function handleResize() {
  initParticles()
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    initParticles()
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseleave', handleMouseLeave)
})
</script>

<style scoped>
.particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
</style>