<template>
  <div class="fixed inset-0 bg-black bg-opacity-80 text-white flex items-center justify-center" v-if="visible">
    <div class="p-4 max-w-md">
      <h2 class="text-xl mb-2">How to Play</h2>
      <!-- TODO: tutorial steps -->
      <button class="btn mt-4" @click="visible = false">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
// TODO: expose methods to open overlay
</script>
