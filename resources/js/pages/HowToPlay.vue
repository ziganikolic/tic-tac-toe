<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          How to Play Ultimate Tic-Tac-Toe
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Learn the rules and strategies of this exciting variant
        </p>
      </div>

      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Basic Rules -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            🎯 Basic Rules
          </h2>
          <div class="space-y-4">
            <p class="text-gray-600 dark:text-gray-300">
              Ultimate Tic-Tac-Toe consists of nine 3×3 tic-tac-toe boards arranged in a 3×3 grid, creating a "mega-board" of nine mini-boards.
            </p>
            <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Players take turns placing X's and O's on the mini-boards</li>
              <li>To win the game, you must win three mini-boards in a row (horizontally, vertically, or diagonally)</li>
              <li>Each mini-board is won by getting three in a row, just like regular tic-tac-toe</li>
            </ul>
          </div>
        </div>

        <!-- The Key Rule -->
        <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl shadow-xl p-8 border border-yellow-200 dark:border-yellow-700">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            🔑 The Key Rule: Board Selection
          </h2>
          <div class="space-y-4">
            <p class="text-gray-700 dark:text-gray-300 font-medium">
              Here's what makes Ultimate Tic-Tac-Toe strategic:
            </p>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-yellow-300 dark:border-yellow-600">
              <p class="text-gray-600 dark:text-gray-300">
                <strong>The position where you place your mark determines which mini-board your opponent must play in next!</strong>
              </p>
            </div>
            <p class="text-gray-600 dark:text-gray-300">
              For example: If you place your mark in the top-right cell of any mini-board, your opponent must make their next move somewhere in the top-right mini-board.
            </p>
            <p class="text-gray-600 dark:text-gray-300">
              <strong>Exception:</strong> If the designated mini-board is already won or full, the opponent can play in any available mini-board.
            </p>
          </div>
        </div>

        <!-- Game Flow -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            📋 Game Flow
          </h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Step by Step:</h3>
              <ol class="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Player X starts by choosing any cell in any mini-board</li>
                <li>Player O must play in the mini-board corresponding to X's cell position</li>
                <li>The game continues with each move determining the next player's board</li>
                <li>Win mini-boards to control the mega-board</li>
                <li>First to get three mini-boards in a row wins!</li>
              </ol>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Winning Conditions:</h3>
              <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li><strong>Mini-board:</strong> Three in a row within a single 3×3 board</li>
                <li><strong>Mega-board:</strong> Three mini-boards in a row</li>
                <li><strong>Draw:</strong> All mini-boards filled with no mega-board winner</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Strategy Tips -->
        <div class="bg-green-50 dark:bg-green-900/20 rounded-2xl shadow-xl p-8 border border-green-200 dark:border-green-700">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            💡 Strategy Tips
          </h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Offensive Strategy:</h3>
              <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Try to send opponents to mini-boards where they have limited options</li>
                <li>Win mini-boards in positions that give you multiple ways to win the mega-board</li>
                <li>Control the center mini-board when possible</li>
              </ul>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Defensive Strategy:</h3>
              <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Block your opponent from winning mini-boards in strategic positions</li>
                <li>Send opponents to mini-boards where you have an advantage</li>
                <li>Watch for mega-board winning threats</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Visual Example -->
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-2xl shadow-xl p-8 border border-blue-200 dark:border-blue-700">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            👁️ Visual Guide
          </h2>
          <div class="text-center">
            <div class="inline-block bg-white dark:bg-gray-800 rounded-lg p-6 border border-blue-300 dark:border-blue-600">
              <div class="grid grid-cols-3 gap-1 w-48 h-48 mx-auto">
                <div v-for="i in 9" :key="i" 
                     class="bg-gray-100 dark:bg-gray-700 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs font-mono">
                  {{ i }}
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-4">
                Each numbered square represents a mini-board.<br>
                If you play in position 1 of any mini-board,<br>
                your opponent must play in mini-board 1.
              </p>
            </div>
          </div>
        </div>

        <!-- Ready to Play -->
        <div class="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to Play?
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Now that you know the rules, it's time to test your skills!
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button @click="playLocal" size="lg">
              Practice Locally
            </Button>
            <Button @click="playOnline" variant="outline" size="lg">
              Play Online
            </Button>
            <Button @click="goHome" variant="ghost" size="lg">
              ← Back to Home
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

function playLocal() {
  router.visit('/room/local')
}

function playOnline() {
  router.visit('/lobby')
}

function goHome() {
  router.visit('/')
}
</script>