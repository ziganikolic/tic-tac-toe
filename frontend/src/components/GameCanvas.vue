<template>
  <div
    v-if="board"
    class="grid gap-1 p-4 mx-auto"
    :style="{ gridTemplateColumns: `repeat(${board.size}, minmax(0,1fr))` }"
  >
    <div
      v-for="cell in board.cells"
      :key="`${cell.row}-${cell.col}`"
      class="w-16 h-16 border border-gray-500 flex items-center justify-center text-2xl cursor-pointer select-none"
      @click="onCellClick(cell)"
    >
      {{ cell.value }}
    </div>
  </div>
  <div v-else class="p-4 text-center">No game state</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GameState, Cell } from '../stores/game';

const props = defineProps<{ state: GameState | null }>();
const emit = defineEmits<{ (e: 'move', payload: Cell): void }>();

const board = computed(() => props.state?.boards[0] || null);

function onCellClick(cell: Cell) {
  emit('move', cell);
}
</script>
