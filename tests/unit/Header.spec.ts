// tests/unit/Header.spec.ts
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Navbar from "../../src/components/Header.vue";
import { createMemoryHistory, createRouter } from "vue-router";

// Setup a mock router
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/", name: "Home", component: { template: "<div>Home</div>" } },
    { path: "/stocks", name: "Stocks", component: { template: "<div>Stocks</div>" } },
  ],
});

describe("Navbar.vue", () => {
  beforeEach(async () => {
    router.push("/");
    await router.isReady();
  });

  it("renders the brand name", async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain("StockPWA");
  });

  it("renders navigation links", async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain("Home");
    expect(wrapper.text()).toContain("Stocks");
  });

  it("has correct href values for links", async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    });

    const links = wrapper.findAll("a");
    // First link is the logo/brand
    expect(links[0].attributes("href")).toBe("/");
    // Second link is Home
    expect(links[1].attributes("href")).toBe("/");
    // Third link is Stocks
    expect(links[2].attributes("href")).toBe("/stocks");
  });
});
