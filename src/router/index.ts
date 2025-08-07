import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import StockList from "../views/StockList.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/stocks", component: StockList },
  {
    path: "/stocks/:symbol",
    name: "StockDetail",
    component: () => import("../views/StockDetails.vue"),
    props: true, // makes :symbol available as a prop
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Всегда прокручивать к верху страницы
    return { top: 0 };
  },
});

export default router;
