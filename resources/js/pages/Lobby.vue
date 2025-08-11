<template>
  <div class="p-4 space-y-6">
    <div>
      <Button @click="createRoom">Create Room</Button>
    </div>

    <form class="space-x-2" @submit.prevent="joinRoom">
      <Input v-model="roomId" placeholder="Room ID" />
      <Button type="submit">Join Room</Button>
    </form>

    <div v-if="recentRooms.length" class="mt-4">
      <h3 class="mb-2">Recent Rooms</h3>
      <ul class="list-disc pl-4">
        <li v-for="r in recentRooms" :key="r">
          <a href="#" @click.prevent="join(r)">{{ r }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { router } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const roomId = ref('')
const recentRooms = ref<string[]>([])

onMounted(() => {
  const stored = localStorage.getItem('recentRooms')
  if (stored) {
    recentRooms.value = JSON.parse(stored)
  }
})

function persist() {
  localStorage.setItem('recentRooms', JSON.stringify(recentRooms.value))
}

function addRecent(id: string) {
  recentRooms.value = [id, ...recentRooms.value.filter(r => r !== id)].slice(0, 5)
  persist()
}

async function createRoom() {
  const res = await fetch('/api/rooms', { method: 'POST' })
  const data = await res.json()
  addRecent(String(data.id))
  router.visit(`/room/${data.id}`)
}

function join(id: string) {
  roomId.value = id
  joinRoom()
}

function joinRoom() {
  if (!roomId.value) return
  addRecent(roomId.value)
  router.visit(`/room/${roomId.value}`)
}
</script>
