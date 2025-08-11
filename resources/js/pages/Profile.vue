<template>
  <div class="p-4 space-y-4">
    <form class="space-y-4" @submit.prevent="save">
      <div>
        <Label for="nick">Nickname</Label>
        <Input id="nick" v-model="nickname" class="mt-1" />
      </div>
      <div>
        <Label for="avatar">Avatar</Label>
        <input id="avatar" type="file" @change="onAvatar" class="mt-1" />
      </div>
      <Button type="submit">Save</Button>
    </form>
    <div v-if="preview" class="mt-4">
      <img :src="preview" alt="avatar" class="w-16 h-16 rounded-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const nickname = ref('')
const avatar = ref<File | null>(null)
const preview = ref<string | null>(null)

function onAvatar(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  avatar.value = file || null
  if (file) {
    preview.value = URL.createObjectURL(file)
  }
}

function save() {
  localStorage.setItem('profile', JSON.stringify({ nickname: nickname.value }))
}
</script>
