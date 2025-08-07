<!-- src/components/Navbar.vue -->
<template>
  <nav class="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
    <router-link to="/" class="text-2xl font-bold text-indigo-400 hover:text-indigo-300">
      📈 StockPWA
    </router-link>
    <div class="space-x-4">
      <router-link to="/" class="hover:text-indigo-400 transition">Home</router-link>
      <router-link to="/stocks" class="hover:text-indigo-400 transition">Stocks</router-link>
    </div>
  </nav>
</template>
