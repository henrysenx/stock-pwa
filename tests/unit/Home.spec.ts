import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import LandingPage from "../../src/views/Home.vue";
import { createRouter, createMemoryHistory } from "vue-router";

// Define dummy routes
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/stocks", name: "Stocks", component: { template: "<div>Stocks Page</div>" } },
  ],
});

describe("LandingPage.vue", () => {
  it("renders the main heading", async () => {
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain("Real-Time Stock Tracker");
  });

  it("renders the description paragraph", () => {
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain("Get live updates on stock prices");
  });

  it("renders the 'View Stocks' router-link", async () => {
    const wrapper = mount(LandingPage, {
      global: {
        plugins: [router],
      },
    });

    const link = wrapper.findComponent({ name: "RouterLink" });

    expect(link.exists()).toBe(true);
    expect(link.props("to")).toBe("/stocks");
  });
});
