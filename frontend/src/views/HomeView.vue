<template>
  <div class="p-4 flex flex-col gap-4 items-center">
    <h1 class="text-2xl">Ultimate Tic Tac Toe</h1>
    <router-link to="/lobby" class="btn">Play Online</router-link>
    <button class="btn" @click="playLocal">Play Local (Hot-seat)</button>
    <router-link to="/how" class="btn">How to Play</router-link>
  </div>
</template>

<script setup lang="ts">
// TODO: hot-seat setup
function playLocal() {
  // TODO: init local game and navigate to RoomView
}
</script>
