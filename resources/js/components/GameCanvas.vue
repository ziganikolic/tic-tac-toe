<template>
  <div ref="gameContainer" class="w-full h-full min-h-[500px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
    <div ref="gameWrapper" class="relative"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import GameScene from '@/Game/Phaser/GameScene'

const gameContainer = ref<HTMLElement>()
const gameWrapper = ref<HTMLElement>()
let game: any = null
let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()
  await loadPhaserAndInitialize()
  setupResizeObserver()
})

onUnmounted(() => {
  cleanup()
})

async function loadPhaserAndInitialize() {
  try {
    // Dynamic import to avoid SES issues
    const Phaser = await import('phaser')
    
    if (!gameContainer.value || !gameWrapper.value) return
    
    const containerRect = gameContainer.value.getBoundingClientRect()
    const size = Math.min(containerRect.width, containerRect.height) - 40
    
    if (size <= 0) return
    
    const config = {
      type: Phaser.default.AUTO,
      width: size,
      height: size,
      parent: gameWrapper.value,
      scene: [GameScene],
      scale: {
        mode: Phaser.default.Scale.NONE,
        autoCenter: Phaser.default.Scale.CENTER_BOTH
      },
      backgroundColor: '#f8fafc',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },
      render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false
      }
    }
    
    game = new Phaser.default.Game(config)
    
  } catch (error) {
    console.error('Failed to initialize Phaser game:', error)
    // Fallback to canvas-based implementation
    initializeFallback()
  }
}

function initializeFallback() {
  if (!gameWrapper.value) return
  
  const canvas = document.createElement('canvas')
  const containerRect = gameContainer.value?.getBoundingClientRect()
  const size = containerRect ? Math.min(containerRect.width, containerRect.height) - 40 : 500
  
  canvas.width = size
  canvas.height = size
  canvas.style.border = '2px solid #e2e8f0'
  canvas.style.borderRadius = '8px'
  
  gameWrapper.value.appendChild(canvas)
  
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = '#64748b'
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Ultimate Tic-Tac-Toe', size / 2, size / 2 - 10)
    ctx.fillText('Click to start playing', size / 2, size / 2 + 10)
  }
}

function setupResizeObserver() {
  if (!gameContainer.value || !window.ResizeObserver) return
  
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      handleResize(entry.contentRect)
    }
  })
  
  resizeObserver.observe(gameContainer.value)
}

function handleResize(rect: DOMRectReadOnly) {
  if (!game || !game.scale) return
  
  const size = Math.min(rect.width, rect.height) - 40
  
  if (size > 0) {
    try {
      game.scale.resize(size, size)
    } catch (error) {
      console.warn('Failed to resize game:', error)
    }
  }
}

function cleanup() {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  
  if (game) {
    try {
      game.destroy(true, false)
    } catch (error) {
      console.warn('Error destroying game:', error)
    }
    game = null
  }
  
  if (gameWrapper.value) {
    gameWrapper.value.innerHTML = ''
  }
}
</script>
