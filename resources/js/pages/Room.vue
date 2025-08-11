<template>
  <div class="p-4">
    <TopBar />
    <GameCanvas />
    <SidePanel />
  </div>
</template>

<script setup lang="ts">
import GameCanvas from '@/components/GameCanvas.vue';
import SidePanel from '@/components/SidePanel.vue';
import TopBar from '@/components/TopBar.vue';
</script>
