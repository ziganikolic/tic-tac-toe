<template>
  <div class="p-4 space-y-4">
    <div>
      <label class="block mb-1">Theme</label>
      <select v-model="theme" class="border rounded p-1">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>

    <div class="flex items-center gap-2">
      <Checkbox id="sound" v-model="sound" />
      <Label for="sound">Sound</Label>
    </div>

    <div class="flex items-center gap-2">
      <Checkbox id="vibration" v-model="vibration" />
      <Label for="vibration">Vibration</Label>
    </div>

    <div class="mt-4">
      <h3 class="font-semibold">Rules</h3>
      <p class="text-sm">Read-only</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const theme = ref('light')
const sound = ref(true)
const vibration = ref(true)
</script>
