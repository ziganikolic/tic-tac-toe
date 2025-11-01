<template>
  <div v-if="message" class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-700 text-white px-4 py-2 rounded">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const message = ref('');
// TODO: expose show() to display messages
</script>
