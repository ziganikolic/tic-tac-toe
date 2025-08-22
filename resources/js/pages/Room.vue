<template>
  <div class="p-4 space-y-4">
    <TopBar />
    
    <!-- Game Status -->
    <div class="space-y-2 p-4 bg-card rounded-lg border">
      <div v-if="game.state?.over" class="text-center">
        <h2 class="text-2xl font-bold" :class="winnerColor">
          {{ game.state.mega?.winner ? `${game.state.mega.winner} Wins!` : 'Game Over - Draw!' }}
        </h2>
      </div>
      <div v-else class="space-y-1">
        <p class="font-semibold">Current Turn: 
          <span :class="currentPlayerColor">{{ game.state?.current }}</span>
        </p>
        <p v-if="activeMini !== '-'">Active Board: {{ activeMini }}</p>
        <p v-else class="text-muted-foreground">Play anywhere</p>
        <p class="text-sm text-muted-foreground">Turn timer: {{ timer }}s</p>
      </div>
    </div>

    <!-- Game Board -->
    <div class="flex-1 flex items-center justify-center">
      <div class="relative w-full max-w-2xl">
        <!-- Local Game -->
        <SimpleGameBoard v-if="isLocalRoom" />
        
        <!-- Online Game -->
        <OnlineGameBoard v-else :roomId="props.room" />
        
        <!-- Game Over Overlay (only for local games) -->
        <div v-if="isLocalRoom && game.state?.over" 
             class="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div class="text-center space-y-4 p-6 bg-card rounded-lg border shadow-lg">
            <h2 class="text-3xl font-bold" :class="winnerColor">
              {{ game.state.mega?.winner ? `${game.state.mega.winner} Wins!` : 'Draw!' }}
            </h2>
            <div class="flex gap-2">
              <Button @click="playAgain">Play Again</Button>
              <Button variant="outline" @click="goToLobby">Back to Lobby</Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Controls -->
    <SidePanel class="flex gap-2">
      <Button variant="destructive" @click="resign" :disabled="game.state?.over">
        Resign
      </Button>
      <Button @click="rematch">Rematch</Button>
      <Button variant="outline" @click="goToLobby">Leave Game</Button>
    </SidePanel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import SimpleGameBoard from '@/components/SimpleGameBoard.vue'
import OnlineGameBoard from '@/components/OnlineGameBoard.vue'
import SidePanel from '@/components/SidePanel.vue'
import TopBar from '@/components/TopBar.vue'
import { Button } from '@/components/ui/button'
import { echo } from '@/Realtime/echo'
import { useGameStore } from '@/Stores/game'
import { useRoomStore } from '@/Stores/room'

const props = defineProps<{ room: string }>()
const game = useGameStore()
const roomStore = useRoomStore()

const timer = ref(0)
let interval: ReturnType<typeof setInterval>

onMounted(async () => {
  // Only setup local game state for local rooms
  if (props.room === 'local') {
    if (!game.state) {
      game.state = game.createInitialState()
    }
  } else {
    // For online rooms, let OnlineGameBoard handle everything
    await roomStore.joinRoom(props.room)
  }
  
  interval = setInterval(() => timer.value++, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
  
  // Only cleanup online rooms
  if (props.room !== 'local') {
    echo.leave(`room.${props.room}`)
    roomStore.leaveRoom()
  }
})

const isLocalRoom = computed(() => props.room === 'local')

const activeMini = computed(() => {
  const active = game.state?.mega?.activeMini
  if (!active) return '-'
  return `${active.row},${active.col}`
})

const currentPlayerColor = computed(() => {
  return game.state?.current === 'X' ? 'text-red-600' : 'text-blue-600'
})

const winnerColor = computed(() => {
  const winner = game.state?.mega?.winner
  if (winner === 'X') return 'text-red-600'
  if (winner === 'O') return 'text-blue-600'
  return 'text-muted-foreground'
})

function resign() {
  if (game.state?.over) return
  
  // Set game as over with opponent as winner
  if (game.state) {
    game.state.over = true
    game.state.mega.winner = game.state.current === 'X' ? 'O' : 'X'
  }
}

function rematch() {
  router.visit('/lobby')
}

function playAgain() {
  // Reset game state for local play
  if (props.room === 'local') {
    game.$patch({ state: null })
    game.state = game.createInitialState()
  } else {
    // For online games, go back to lobby
    router.visit('/lobby')
  }
}

function goToLobby() {
  router.visit('/lobby')
}
</script>
