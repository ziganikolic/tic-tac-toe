<template>
  <div class="w-full max-w-[600px] mx-auto p-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center h-96">
      <div class="text-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading game...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center h-96">
      <div class="text-center space-y-4">
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        <button
          @click="reconnect"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reconnect
        </button>
      </div>
    </div>

    <!-- Game Board -->
    <div v-else-if="gameState">
      <!-- Game Board Grid -->
      <div class="grid grid-cols-3 gap-2 bg-slate-200 dark:bg-slate-700 p-2 rounded-xl">
        <div
          v-for="(miniBoard, miniIndex) in formattedBoard"
          :key="`mini-${miniIndex}`"
          :class="[
            'relative grid grid-cols-3 gap-1 p-2 rounded-lg transition-all duration-200',
            {
              'bg-blue-100 dark:bg-blue-900 ring-4 ring-blue-500 shadow-lg': isActiveMini(miniIndex),
              'bg-white dark:bg-slate-800': !isActiveMini(miniIndex) && !miniBoard.winner,
              'bg-red-100 dark:bg-red-900': miniBoard.winner === 'X',
              'bg-blue-100 dark:bg-blue-900': miniBoard.winner === 'O',
              'bg-gray-100 dark:bg-gray-700': miniBoard.winner === 'DRAW'
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
                'bg-slate-50 dark:bg-slate-700 cursor-not-allowed opacity-30': !canMakeMove(miniIndex, cellIndex),
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
      <div class="mt-6 text-center space-y-2">
        <div v-if="gameState.over">
          <h2 class="text-3xl font-bold" :class="{
            'text-red-600': gameState.mega?.winner === 'X',
            'text-blue-600': gameState.mega?.winner === 'O',
            'text-gray-600': !gameState.mega?.winner
          }">
            {{ gameState.mega?.winner ? `${gameState.mega.winner} Wins!` : 'Draw!' }}
          </h2>
        </div>
        <div v-else>
          <p class="text-lg font-semibold">
            Current Turn: 
            <span :class="{
              'text-red-600': gameState.current === 'X',
              'text-blue-600': gameState.current === 'O'
            }">
              {{ gameState.current }}
            </span>
          </p>
          <p v-if="activeMiniIndex !== null" class="text-sm text-gray-600 dark:text-gray-400">
            Must play in the highlighted mini-board (position {{ Math.floor(activeMiniIndex / 3) + 1 }}, {{ (activeMiniIndex % 3) + 1 }})
          </p>
          <p v-else class="text-sm text-gray-600 dark:text-gray-400">
            Play in any available board
          </p>
        </div>
      </div>

      <!-- Room Info -->
      <div class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Room ID: <span class="font-mono font-bold">{{ roomId }}</span>
        <br>
        Move: {{ gameState.moveIndex + 1 }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { echo } from '@/Realtime/echo'

const props = defineProps<{
  roomId: string
}>()

// State
const gameState = ref<any>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Lifecycle
onMounted(async () => {
  await loadGameState()
  setupWebSocketListener()
})

onUnmounted(() => {
  echo.leaveChannel(`room.${props.roomId}`)
})

// Computed
const formattedBoard = computed(() => {
  if (!gameState.value?.mega?.boards) return []
  
  return gameState.value.mega.boards.flat().map((miniBoard: any) => ({
    winner: miniBoard.winner,
    isClosed: miniBoard.isClosed,
    cells: miniBoard.cells.map((cell: any) => cell.value)
  }))
})

const activeMiniIndex = computed(() => {
  const activeMini = gameState.value?.mega?.activeMini
  if (!activeMini) return null
  return activeMini.row * 3 + activeMini.col
})

// Methods
async function loadGameState() {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await fetch(`/api/rooms/${props.roomId}`)
    
    if (!response.ok) {
      throw new Error(`Failed to load room: ${response.status}`)
    }
    
    gameState.value = await response.json()
  } catch (err: any) {
    error.value = err.message || 'Failed to load game'
    console.error('Failed to load game state:', err)
  } finally {
    isLoading.value = false
  }
}

function setupWebSocketListener() {
  try {
    // Use channel() instead of join() for public channels
    echo.channel(`room.${props.roomId}`)
      .listen('.state_sync', (e: any) => {
        console.log('Received state sync:', e)
        gameState.value = e.state
      })
      .error((error: any) => {
        console.error('WebSocket error:', error)
      })
      
    console.log(`Listening to channel: room.${props.roomId}`)
  } catch (err) {
    console.error('Failed to setup WebSocket:', err)
  }
}

function isActiveMini(miniIndex: number): boolean {
  return activeMiniIndex.value === miniIndex
}

function canMakeMove(miniIndex: number, cellIndex: number): boolean {
  if (!gameState.value || gameState.value.over) return false
  
  // Check if we must play in specific mini board
  if (activeMiniIndex.value !== null && activeMiniIndex.value !== miniIndex) return false
  
  // Check if mini board is closed
  const miniRow = Math.floor(miniIndex / 3)
  const miniCol = miniIndex % 3
  const miniBoard = gameState.value.mega?.boards?.[miniRow]?.[miniCol]
  if (!miniBoard || miniBoard.isClosed) return false
  
  // Check if cell is empty
  const cellRow = Math.floor(cellIndex / 3)
  const cellCol = cellIndex % 3
  const cell = miniBoard.cells?.find((c: any) => c.row === cellRow && c.col === cellCol)
  
  return cell && !cell.value
}

async function makeMove(miniIndex: number, cellIndex: number) {
  if (!canMakeMove(miniIndex, cellIndex)) return
  
  const miniRow = Math.floor(miniIndex / 3)
  const miniCol = miniIndex % 3
  const cellRow = Math.floor(cellIndex / 3)
  const cellCol = cellIndex % 3
  
  try {
    const response = await fetch(`/api/rooms/${props.roomId}/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        mini: { row: miniRow, col: miniCol },
        cell: { row: cellRow, col: cellCol },
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      let errorMessage = errorData.message || 'Invalid move'
      
      // Provide more specific error messages for common issues
      if (response.status === 422 && errorMessage === 'Invalid move') {
        if (activeMiniIndex.value !== null && activeMiniIndex.value !== miniIndex) {
          errorMessage = `Must play in the highlighted mini-board (${Math.floor(activeMiniIndex.value / 3) + 1}, ${(activeMiniIndex.value % 3) + 1})`
        } else {
          errorMessage = 'Invalid move - cell may already be occupied or board is closed'
        }
      }
      
      throw new Error(errorMessage)
    }
    
    const newState = await response.json()
    gameState.value = newState
    
  } catch (err: any) {
    console.error('Failed to make move:', err)
    error.value = err.message || 'Failed to make move'
    
    // Clear error after 3 seconds
    setTimeout(() => {
      error.value = null
    }, 3000)
  }
}

function reconnect() {
  loadGameState()
  setupWebSocketListener()
}
</script>