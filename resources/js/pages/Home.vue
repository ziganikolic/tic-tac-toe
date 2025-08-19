<template>
  <div class="p-4 space-y-4">
    <Button @click="playOnline">Play Online</Button>
    <Button @click="playLocal">Play Local</Button>
    <Button @click="howTo">How to Play</Button>
  </div>
</template>

<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'

function playOnline() {
  router.visit('/lobby')
}

async function playLocal() {
  try {
    const res = await fetch('/api/rooms', { method: 'POST' })
    if (!res.ok) {
      throw new Error('Room creation failed')
    }
    const data = await res.json()
    router.visit(`/room/${data.id}`)
  } catch (e) {
    console.error(e)
  }
}

function howTo() {
  router.visit('/how-to')
}
</script>
