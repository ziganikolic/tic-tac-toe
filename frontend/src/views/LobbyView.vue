<template>
  <div class="p-4">
    <h2 class="text-xl mb-2">Lobby</h2>
    <div class="flex gap-2">
      <button class="btn" @click="createRoom">Create Room</button>
      <input v-model="roomId" placeholder="Room ID" class="input" />
      <button class="btn" @click="joinRoom">Join Room</button>
    </div>
    <!-- TODO: list recent rooms from localStorage -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const roomId = ref('');

async function createRoom() {
  // TODO: POST /api/rooms then navigate
}

async function joinRoom() {
  // TODO: navigate to /room/:roomId
  router.push(`/room/${roomId.value}`);
}
</script>
