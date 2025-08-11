<template>
  <div v-if="message" class="toast">{{ message }}</div>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue';

const message = ref<string | null>(null);

function toast(text: string) {
  message.value = text;
  setTimeout(() => (message.value = null), 3000);
}

defineExpose({ toast, message });
</script>
