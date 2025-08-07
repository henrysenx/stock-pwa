<!-- src/pages/LandingPage.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white flex flex-col items-center justify-center px-4">
    <h1 class="text-4xl sm:text-6xl font-bold mb-4 text-center">
      Real-Time Stock Tracker
    </h1>
    <p class="text-lg sm:text-xl text-gray-300 mb-6 text-center max-w-2xl">
      Get live updates on stock prices, detailed analytics, and trends. Designed for investors, traders, and curious minds.
    </p>
    <router-link
      to="/stocks"
      class="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
    >
      View Stocks
    </router-link>
  </div>
</template>

<script setup>
// No logic needed for now
</script>

<style scoped>
/* Optional: Add fade-in or animation here */
</style>
