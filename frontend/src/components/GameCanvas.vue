<template>
  <div ref="gameContainer" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Phaser from 'phaser';
import type { GameState } from '../stores/game';

const props = defineProps<{ state: GameState | null }>();
const emit = defineEmits<{ (e: 'move', payload: any): void }>();

const gameContainer = ref<HTMLDivElement | null>(null);
let phaserGame: Phaser.Game | null = null;

onMounted(() => {
  // TODO: init Phaser scene with props.state
});

watch(() => props.state, state => {
  // TODO: update scene on state change
});

// TODO: handle resize, pointer events -> emit('move')
</script>
