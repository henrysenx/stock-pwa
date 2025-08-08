<template>
  <div class="p-4 space-y-6">
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

    <!-- Company Header -->
    <div
      v-else-if="profile"
      class="flex items-center gap-4 p-4 bg-white shadow rounded-lg"
    >
      <img
        :src="profile.logo || fallbackLogo"
        @error="handleLogoError"
        alt="Logo"
        class="w-16 h-16 rounded-full object-contain border"
      />
      <div>
        <h2 class="text-2xl font-semibold">
          {{ profile.name }}
          <span class="text-sm text-gray-500">({{ profile.ticker }})</span>
        </h2>
        <p class="text-gray-600">{{ profile.exchange }}</p>
        <a
          v-if="profile.weburl"
          :href="profile.weburl"
          target="_blank"
          class="text-blue-600 text-sm underline"
        >
          Visit Website
        </a>
      </div>
    </div>

    <!-- Real-time Quote -->
    <div
      v-if="quote && !loading"
      class="bg-gray-50 rounded-lg shadow p-4 grid grid-cols-2 sm:grid-cols-3 gap-4"
    >
      <div>
        <div class="text-sm text-gray-500">Current Price</div>
        <div class="text-lg font-bold">${{ quote.c.toFixed(2) }}</div>
      </div>
      <div>
        <div class="text-sm text-gray-500">Change</div>
        <div
          :class="{
            'text-green-600': quote.d >= 0,
            'text-red-600': quote.d < 0,
          }"
        >
          {{ quote.d >= 0 ? "+" : "" }}{{ quote.d.toFixed(2) }}
        </div>
      </div>
      <div>
        <div class="text-sm text-gray-500">Change %</div>
        <div
          :class="{
            'text-green-600': quote.dp >= 0,
            'text-red-600': quote.dp < 0,
          }"
        >
          {{ quote.dp >= 0 ? "+" : "" }}{{ quote.dp.toFixed(2) }}%
        </div>
      </div>
      <div>
        <div class="text-sm text-gray-500">Open</div>
        <div>${{ quote.o.toFixed(2) }}</div>
      </div>
      <div>
        <div class="text-sm text-gray-500">High</div>
        <div>${{ quote.h.toFixed(2) }}</div>
      </div>
      <div>
        <div class="text-sm text-gray-500">Low</div>
        <div>${{ quote.l.toFixed(2) }}</div>
      </div>
      <div>
        <div class="text-sm text-gray-500">Previous Close</div>
        <div>${{ quote.pc.toFixed(2) }}</div>
      </div>
    </div>

    <!-- Chart -->
     <div class="bg-gray-50 rounded-lg shadow p-4">
      <apexchart
        v-if="series.length"
        type="candlestick"
        :options="chartOptions"
        :series="series"
        height="350"
      />
      <div v-else class="text-gray-500 italic">No historical data available.</div>
     </div>

    <!-- Error State -->
    <div v-if="!profile && !loading" class="text-center text-red-500 mt-6">
      Failed to load company data.
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import { finHubAPI, alphaVantageApi } from "../services/axios";

export default {
  name: "StockDetail",
  data() {
    return {
      profile: null,
      quote: null,
      loading: true,
      fallbackLogo: "https://via.placeholder.com/64?text=Logo",
      refreshIntervalId: null,
      series: []
    };
  },
  methods: {
    async fetchCompanyProfile() {
      try {
        const symbol = this.$route.params.symbol;
        const res = await finHubAPI.get(
          `/stock/profile2?symbol=${symbol}&token=${
            import.meta.env.VITE_API_KEY
          }`
        );
        this.profile = res.data;
      } catch (err) {
        console.error("Error loading company profile:", err);
      }
    },
    async fetchQuote() {
      try {
        const symbol = this.$route.params.symbol;
        const res = await finHubAPI.get(
          `/quote?symbol=${symbol}&token=${import.meta.env.VITE_API_KEY}`
        );
        this.quote = res.data;
      } catch (err) {
        console.error("Error loading quote:", err);
      }
    },
    handleLogoError(e) {
      e.target.src = this.fallbackLogo;
    },
    async fetchHistoricalData() {
      const now = Math.floor(Date.now() / 1000);
      const oneMonthAgo = now - 60 * 60 * 24 * 30;
      const symbol = this.$route.params.symbol;

      const res = await finHubAPI.get(
        `/stock/candle?symbol=${symbol}&resolution=D&from=${oneMonthAgo}&to=${now}&token=${
          import.meta.env.VITE_API_KEY
        }`
      );

      if (res.data.s === "ok") {
        console.log(res.data, "@@@");

        this.series = [
          {
            name: "Close Price",
            data: res.data.t.map((t, i) => ({
              x: new Date(t * 1000),
              y: res.data.c[i],
            })),
          },
        ];

        this.chartOptions = {
          chart: {
            type: "line",
            toolbar: { show: false },
          },
          stroke: {
            curve: "smooth",
          },
          xaxis: {
            type: "datetime",
          },
          tooltip: {
            x: {
              format: "dd MMM yyyy",
            },
          },
        };
      }
    },
    // async fetchDailyPrice() {
    //   const symbol = this.$route.params.symbol;
    //   const res = await alphaVantageApi.get(
    //     `/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${
    //       import.meta.env.VITE_API_KEY2
    //     }`
    //   );

    //   if (res.data["Time Series (Daily)"]) {
    //     const dailyData = Object.entries(res.data["Time Series (Daily)"]).slice(0,30).map(
    //       ([date, data]) => ({
    //         x: format(new Date(date), "yyyy-MM-dd"),
    //         y: parseFloat(data["4. close"]),
    //       })
    //     );

    //     this.series = [
    //       {
    //         name: "Daily Price",
    //         data: dailyData,
    //       },
    //     ];

    //     this.chartOptions = {
    //       chart: {
    //         type: "line",
    //         toolbar: { show: false },
    //       },
    //       stroke: {
    //         curve: "smooth",
    //       },
    //       xaxis: {
    //         type: "datetime",
    //       },
    //       tooltip: {
    //         x: {
    //           format: "dd MMM yyyy",
    //         },
    //       },
    //     };

    //     console.log("Daily Price Data:", dailyData);
        
    //   }
    // },
    async fetchDailyPrice() {
  const symbol = this.$route.params.symbol;
  const res = await alphaVantageApi.get(
    `/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${
      import.meta.env.VITE_API_KEY2
    }`
  );

  if (res.data["Time Series (Daily)"]) {
    const dailyData = Object.entries(res.data["Time Series (Daily)"])
      .slice(0, 30) // latest 30 days
      .map(([date, data]) => ({
        x: new Date(date),
        y: [
          parseFloat(data["1. open"]),
          parseFloat(data["2. high"]),
          parseFloat(data["3. low"]),
          parseFloat(data["4. close"])
        ]
      }));

    this.series = [
      {
        name: "Daily Price",
        data: dailyData,
      },
    ];

    this.chartOptions = {
      chart: {
        type: "candlestick",
        toolbar: { show: false },
      },
      xaxis: {
        type: "datetime",
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy",
        },
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    };

    console.log("Candlestick Data:", dailyData);
  }
}

  },
  async created() {
    const symbol = this.$route.params.symbol;
    this.loading = true;

    await Promise.all([
      this.fetchCompanyProfile(),
      this.fetchQuote(),
      this.fetchDailyPrice(),
      //   this.fetchHistoricalData(),
    ]);

    // Set up auto-refresh for quote
    this.refreshIntervalId = setInterval(() => {
      this.fetchQuote();
    }, 60000); // refresh every 30 seconds

    this.loading = false;
  },
  beforeDestroy() {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
  },
};
</script>

<style scoped></style>
