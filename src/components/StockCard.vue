<template>
  <div class="border p-4 rounded hover:shadow cursor-pointer" @click="$emit('click', stock.symbol)" data-cy="stock-card">
    <h3 class="text-lg font-semibold">{{ stock.symbol }}</h3>
    <p class="text-sm text-gray-600">{{ stock.description }}</p>
    <p class="text-xs text-gray-400 mt-1">Exchange: {{ stock.mic }}</p>
  </div>
</template>

<script>
export default {
  name: 'StockCard',
  props: {
    stock: {
      type: Object,
      required: true,
    },
  },
};
</script>
