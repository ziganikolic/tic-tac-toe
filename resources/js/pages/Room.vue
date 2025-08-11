<template>
  <div class="p-4 space-y-4">
    <TopBar />
    <div class="space-y-1">
      <p>Current: {{ state?.current }}</p>
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

const props = defineProps<{ room: string }>()

const state = ref<any>(null)
const timer = ref(0)
let interval: ReturnType<typeof setInterval>

onMounted(async () => {
  const res = await fetch(`/api/rooms/${props.room}`)
  state.value = await res.json()
  interval = setInterval(() => timer.value++, 1000)
})

onUnmounted(() => clearInterval(interval))

const activeMini = computed(() => {
  if (!state.value || !state.value.mega.activeMini) return '-'
  const { row, col } = state.value.mega.activeMini
  return `${row},${col}`
})

function resign() {
  console.log('resign')
}

function rematch() {
  router.visit('/lobby')
}
</script>
