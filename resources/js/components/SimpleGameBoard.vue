<template>
  <div class="w-full max-w-[600px] mx-auto p-4">
    <!-- Game Board -->
    <div class="grid grid-cols-3 gap-2 bg-slate-200 dark:bg-slate-700 p-2 rounded-xl">
      <div
        v-for="(miniBoard, miniIndex) in gameBoard"
        :key="`mini-${miniIndex}`"
        :class="[
          'relative grid grid-cols-3 gap-1 p-2 rounded-lg transition-all duration-200',
          {
            'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-400': isActiveMini(miniIndex),
            'bg-white dark:bg-slate-800': !isActiveMini(miniIndex) && !miniBoard.winner,
            'bg-red-100 dark:bg-red-900': miniBoard.winner === 'X',
            'bg-blue-100 dark:bg-blue-900': miniBoard.winner === 'O',
            'bg-gray-100 dark:bg-gray-700': miniBoard.winner && miniBoard.winner !== 'X' && miniBoard.winner !== 'O'
          }
        ]"
      >
        <!-- Mini Board Winner Overlay -->
        <div
          v-if="miniBoard.winner"
          class="col-span-3 row-span-3 flex items-center justify-center text-6xl font-bold opacity-80 pointer-events-none absolute z-10"
          :class="{
            'text-red-600': miniBoard.winner === 'X',
            'text-blue-600': miniBoard.winner === 'O',
            'text-gray-600': miniBoard.winner === 'DRAW'
          }"
        >
          {{ miniBoard.winner === 'DRAW' ? '−' : miniBoard.winner }}
        </div>

        <!-- Individual Cells -->
        <button
          v-for="(cell, cellIndex) in miniBoard.cells"
          :key="`cell-${miniIndex}-${cellIndex}`"
          @click="makeMove(miniIndex, cellIndex)"
          :disabled="!canMakeMove(miniIndex, cellIndex)"
          :class="[
            'aspect-square flex items-center justify-center text-2xl font-bold rounded transition-all duration-150',
            {
              'bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 cursor-pointer': canMakeMove(miniIndex, cellIndex),
              'bg-slate-50 dark:bg-slate-700 cursor-not-allowed opacity-50': !canMakeMove(miniIndex, cellIndex),
              'text-red-600': cell === 'X',
              'text-blue-600': cell === 'O'
            }
          ]"
        >
          {{ cell }}
        </button>
      </div>
    </div>

    <!-- Game Status -->
    <div class="mt-6 text-center">
      <div v-if="gameStore.state?.over" class="space-y-2">
        <h2 class="text-3xl font-bold" :class="{
          'text-red-600': gameStore.state.mega?.winner === 'X',
          'text-blue-600': gameStore.state.mega?.winner === 'O',
          'text-gray-600': !gameStore.state.mega?.winner
        }">
          {{ gameStore.state.mega?.winner ? `${gameStore.state.mega.winner} Wins!` : 'Draw!' }}
        </h2>
      </div>
      <div v-else class="space-y-2">
        <p class="text-lg font-semibold">
          Current Turn: 
          <span :class="{
            'text-red-600': gameStore.state?.current === 'X',
            'text-blue-600': gameStore.state?.current === 'O'
          }">
            {{ gameStore.state?.current }}
          </span>
        </p>
        <p v-if="activeMiniIndex !== null" class="text-sm text-gray-600 dark:text-gray-400">
          Must play in highlighted board
        </p>
        <p v-else class="text-sm text-gray-600 dark:text-gray-400">
          Play in any available board
        </p>
      </div>
    </div>

    <!-- Reset Button -->
    <div class="mt-4 text-center">
      <button
        @click="resetGame"
        class="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
      >
        New Game
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGameStore } from '@/Stores/game'

const gameStore = useGameStore()

// Initialize game on mount
onMounted(() => {
  if (!gameStore.state) {
    gameStore.state = gameStore.createInitialState()
  }
})

// Computed properties
const gameBoard = computed(() => {
  if (!gameStore.state?.mega?.boards) return []
  
  return gameStore.state.mega.boards.flat().map((miniBoard: any, index: number) => ({
    winner: miniBoard.winner,
    isClosed: miniBoard.isClosed,
    cells: miniBoard.cells.map((cell: any) => cell.value)
  }))
})

const activeMiniIndex = computed(() => {
  const activeMini = gameStore.state?.mega?.activeMini
  if (!activeMini) return null
  return activeMini.row * 3 + activeMini.col
})

// Helper functions
function isActiveMini(miniIndex: number): boolean {
  return activeMiniIndex.value === miniIndex
}

function canMakeMove(miniIndex: number, cellIndex: number): boolean {
  // Game over
  if (gameStore.state?.over) return false
  
  // Check if we must play in specific mini board
  if (activeMiniIndex.value !== null && activeMiniIndex.value !== miniIndex) return false
  
  // Check if mini board is closed
  const miniRow = Math.floor(miniIndex / 3)
  const miniCol = miniIndex % 3
  const miniBoard = gameStore.state?.mega?.boards?.[miniRow]?.[miniCol]
  if (!miniBoard || miniBoard.isClosed) return false
  
  // Check if cell is empty
  const cellRow = Math.floor(cellIndex / 3)
  const cellCol = cellIndex % 3
  const cell = miniBoard.cells?.find((c: any) => c.row === cellRow && c.col === cellCol)
  
  return cell && !cell.value
}

function makeMove(miniIndex: number, cellIndex: number) {
  if (!canMakeMove(miniIndex, cellIndex)) return
  
  const miniRow = Math.floor(miniIndex / 3)
  const miniCol = miniIndex % 3
  const cellRow = Math.floor(cellIndex / 3)
  const cellCol = cellIndex % 3
  
  gameStore.playLocalMove({
    mini: { row: miniRow, col: miniCol },
    cell: { row: cellRow, col: cellCol }
  })
}

function resetGame() {
  gameStore.state = gameStore.createInitialState()
}
</script>