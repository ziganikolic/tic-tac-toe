<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
    <div class="container mx-auto px-4 py-8">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Ultimate Tic-Tac-Toe
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Experience the classic game with a strategic twist. Play 9 interconnected boards where every move matters.
        </p>
      </div>

      <!-- Game Modes -->
      <div class="max-w-4xl mx-auto">
        <div class="grid md:grid-cols-2 gap-8 mb-12">
          <!-- Local Play Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Local Play</h2>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                Play with a friend on the same device. Perfect for quick games and learning the rules.
              </p>
            </div>
            <Button @click="playLocal" class="w-full" size="lg">
              Start Local Game
            </Button>
          </div>

          <!-- Online Play Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Online Play</h2>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                Create or join online rooms to play with friends anywhere in the world.
              </p>
            </div>
            <Button @click="playOnline" class="w-full" size="lg" variant="outline">
              Go to Lobby
            </Button>
          </div>
        </div>

        <!-- How to Play Section -->
        <div class="text-center">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              New to Ultimate Tic-Tac-Toe?
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              Learn the rules and strategies to master this exciting variant of the classic game.
            </p>
            <Button @click="howTo" variant="ghost" size="lg">
              How to Play
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { router } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'

function playOnline() {
  router.visit('/lobby')
}

function playLocal() {
  router.visit('/room/local')
}

function howTo() {
  router.visit('/how-to')
}
</script>
