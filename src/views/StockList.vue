<template>
  <div class="p-4">
    <!-- Loader -->
    <div v-if="loading" class="flex justify-center items-center min-h-[80vh]">
      <div class="flex space-x-5">
        <div class="w-5 h-5 bg-blue-600 rounded-full animate-bounce"></div>
        <div
          class="w-5 h-5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.2s]"
        ></div>
        <div
          class="w-5 h-5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.4s]"
        ></div>
      </div>
    </div>

    <div v-else class="">
      <!-- Tabs for each MIC -->
      <div class="flex justify-end space-x-2 border-b border-gray-300 mb-4 overflow-x-auto">
        <button
          v-for="mic in micList"
          :key="mic"
          @click="selectedMic = mic"
          :class="[
            'px-4 py-2 whitespace-nowrap border-b-2',
            selectedMic === mic
              ? 'border-blue-500 text-blue-600 font-bold'
              : 'border-transparent text-gray-600 hover:text-blue-500',
          ]"
        >
          {{ mic }}
        </button>
      </div>

      <!-- Filter input -->
      <div class="mb-4">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search by symbol or name"
          class="border rounded px-4 py-2 w-full md:w-1/3"
        />
      </div>

      <!-- Stock Cards for Selected MIC -->
      <div v-if="filteredGroupedStocks[selectedMic]">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
          <StockCard
            v-for="stock in filteredGroupedStocks[selectedMic]"
            :key="stock.symbol"
            :stock="stock"
            @click="goToDetails"
          />
        </div>
      </div>
      <div v-else class="text-gray-500 italic">
        No stocks found for this exchange.
      </div>
    </div>
  </div>
</template>

<script>
import StockCard from "../components/StockCard.vue";
import { finHubAPI } from "../services/axios";

export default {
  name: "StockList",
  components: { StockCard },

  data() {
    return {
      stocks: [],
      selectedMic: "",
      searchTerm: "",
      loading: true,
    };
  },

  computed: {
    micList() {
      const mics = this.stocks.map((stock) => stock.mic || "Unknown");
      return [...new Set(mics)];
    },

    filteredGroupedStocks() {
      const groups = {};

      for (const stock of this.stocks) {
        const mic = stock.mic || "Unknown";

        if (!groups[mic]) groups[mic] = [];

        if (
          stock.symbol.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          stock.description
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        ) {
          groups[mic].push(stock);
        }
      }

      return groups;
    },
  },

  methods: {
    async fetchStocks() {
      this.loading = true;
      try {
        const { data } = await finHubAPI.get(
          `/stock/symbol?exchange=US&token=${import.meta.env.VITE_API_KEY}`
        );

        this.stocks = data;

        // Set default tab
        if (data.length) {
          this.selectedMic = data[0].mic || "Unknown";
        }
      } catch (error) {
        console.error("Error fetching stocks:", error);
      } finally {
        this.loading = false;
      }
    },
    goToDetails(symbol) {
      if (typeof symbol !== "object" && symbol) {
        this.$router.push({ name: "StockDetail", params: { symbol } });
      }
    },
  },

  created() {
    this.fetchStocks();
  },
};
</script>
