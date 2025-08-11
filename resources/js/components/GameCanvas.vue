<template>
  <canvas id="game-canvas" class="w-full h-full"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Phaser from 'phaser'
import GameScene from '@/Game/Phaser/GameScene'

let game: Phaser.Game | null = null

onMounted(() => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement
  game = new Phaser.Game({
    type: Phaser.CANVAS,
    canvas,
    width: canvas.clientWidth,
    height: canvas.clientHeight,
    scene: [GameScene],
    parent: canvas.parentElement || undefined,
  })
})

onUnmounted(() => {
  game?.destroy(true)
  game = null
})
</script>
