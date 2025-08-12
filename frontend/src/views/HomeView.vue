<template>
  <div class="min-h-screen flex flex-col gap-6 items-center justify-center text-center">
    <h1 class="text-3xl font-bold">Ultimate Tic Tac Toe</h1>
    <router-link to="/lobby" class="btn">Play Online</router-link>
    <button class="btn" @click="playLocal">Play Local (Hot-seat)</button>
    <router-link to="/how" class="btn">How to Play</router-link>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';

const router = useRouter();
const game = useGameStore();

function playLocal() {
  game.startLocalGame();
  router.push('/room/local');
}
</script>
