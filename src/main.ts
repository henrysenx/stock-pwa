import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/index.css'

import VueApexCharts from "vue3-apexcharts"
import router from "./router"

const app = createApp(App)

// Register ApexCharts globally
app.use(VueApexCharts)
app.component('apexchart', VueApexCharts)

app.use(router).mount("#app")
