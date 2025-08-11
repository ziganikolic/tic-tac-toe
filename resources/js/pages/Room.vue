<template>
  <div class="p-4 space-y-4">
    <TopBar />
    <div class="space-y-1">
      <p>Current: {{ game.state?.current }}</p>
      <p>Active mini: {{ activeMini }}</p>
      <p>Turn timer: {{ timer }}s</p>
    </div>
    <GameCanvas />
    <SidePanel class="flex gap-2">
      <Button variant="destructive" @click="resign">Resign</Button>
      <Button @click="rematch">Rematch</Button>
    </SidePanel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import GameCanvas from '@/components/GameCanvas.vue'
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
  await roomStore.joinRoom(props.room)
  await game.fetchState(props.room)
  echo.join(`room.${props.room}`).listen('.state_sync', (e: any) => {
    game.applyStateSync(e.state)
  })
  interval = setInterval(() => timer.value++, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
  echo.leave(`room.${props.room}`)
  roomStore.leaveRoom()
})

const activeMini = computed(() => {
  const active = game.state?.mega?.activeMini
  if (!active) return '-'
  return `${active.row},${active.col}`
})

function resign() {
  console.log('resign')
}

function rematch() {
  router.visit('/lobby')
}
</script>
