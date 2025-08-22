<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Game Lobby
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Create a new room or join an existing one to start playing online
        </p>
      </div>

      <div class="max-w-2xl mx-auto space-y-8">
        <!-- Create Room Section -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Create New Room
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Start a new game and share the room ID with your friend
          </p>
          <Button @click="createRoom" class="w-full" size="lg" :disabled="isCreating">
            <span v-if="isCreating">Creating Room...</span>
            <span v-else>Create Room</span>
          </Button>
        </div>

        <!-- Join Room Section -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Join Existing Room
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Enter a room ID to join an ongoing game
          </p>
          <form @submit.prevent="joinRoom" class="space-y-4">
            <Input 
              v-model="roomId" 
              placeholder="Enter Room ID (e.g., 123456)" 
              class="text-center text-lg"
              :disabled="isJoining"
            />
            <Button type="submit" class="w-full" size="lg" variant="outline" :disabled="!roomId.trim() || isJoining">
              <span v-if="isJoining">Joining Room...</span>
              <span v-else>Join Room</span>
            </Button>
          </form>
        </div>

        <!-- Recent Rooms Section -->
        <div v-if="recentRooms.length" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Rooms
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Quickly rejoin rooms you've played in recently
          </p>
          <div class="grid gap-3">
            <button 
              v-for="r in recentRooms" 
              :key="r"
              @click="join(r)"
              class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span class="font-mono text-lg">{{ r }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">Click to join</span>
            </button>
          </div>
        </div>

        <!-- Back to Home -->
        <div class="text-center">
          <Button @click="goHome" variant="ghost">
            ← Back to Home
          </Button>
        </div>
      </div>
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
const isCreating = ref(false)
const isJoining = ref(false)

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
  if (isCreating.value) return
  
  isCreating.value = true
  try {
    const res = await fetch('/api/rooms', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    
    if (!res.ok) {
      throw new Error('Failed to create room')
    }
    
    const data = await res.json()
    addRecent(String(data.id))
    router.visit(`/room/${data.id}`)
  } catch (error) {
    console.error('Error creating room:', error)
    alert('Failed to create room. Please try again.')
  } finally {
    isCreating.value = false
  }
}

function join(id: string) {
  roomId.value = id
  joinRoom()
}

async function joinRoom() {
  if (!roomId.value.trim() || isJoining.value) return
  
  isJoining.value = true
  try {
    // Validate room ID format (should be 6 digits)
    if (!/^\d{6}$/.test(roomId.value.trim())) {
      throw new Error('Room ID must be 6 digits')
    }
    
    addRecent(roomId.value.trim())
    router.visit(`/room/${roomId.value.trim()}`)
  } catch (error) {
    console.error('Error joining room:', error)
    alert('Invalid room ID. Please enter a 6-digit room ID.')
    isJoining.value = false
  }
}

function goHome() {
  router.visit('/')
}
</script>
