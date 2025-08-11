<template>
  <div v-if="visible" class="howto-overlay">
    <slot>Ultimate Tic-Tac-Toe rules go here.</slot>
    <button @click="hide">Close</button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue';

const visible = ref(false);

function show() {
  visible.value = true;
}

function hide() {
  visible.value = false;
}

defineExpose({ show, hide, visible });
</script>
