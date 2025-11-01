<template>
  <div class="flex flex-col md:flex-row h-full">
    <GameCanvas class="flex-1" :state="game.state" @move="onMove" />
    <SidePanel class="w-full md:w-80" />
  </div>
</template>

<script setup lang="ts">
import GameCanvas from '../components/GameCanvas.vue';
import SidePanel from '../components/SidePanel.vue';
import { useGameStore } from '../stores/game';

const game = useGameStore();

function onMove(cell: { row: number; col: number }) {
  if (!game.state) return;
  game.submitMove({
    mini: { row: 0, col: 0 },
    cell,
    moveIndex: game.state.moveIndex + 1
  });
}
</script>
