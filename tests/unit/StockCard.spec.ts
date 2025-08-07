import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import StockCard from "../../src/components/StockCard.vue";

// Sample stock object
const mockStock = {
  symbol: "AAPL",
  description: "Apple Inc.",
  mic: "XNAS",
};

describe("StockCard.vue", () => {
  it("renders the stock symbol", () => {
    const wrapper = mount(StockCard, {
      props: { stock: mockStock },
    });
    expect(wrapper.text()).toContain("AAPL");
  });

  it("renders the stock description", () => {
    const wrapper = mount(StockCard, {
      props: { stock: mockStock },
    });
    expect(wrapper.text()).toContain("Apple Inc.");
  });

  it("renders the stock exchange MIC", () => {
    const wrapper = mount(StockCard, {
      props: { stock: mockStock },
    });
    expect(wrapper.text()).toContain("Exchange: XNAS");
  });

  it("emits click event with stock symbol when clicked", async () => {
    const wrapper = mount(StockCard, {
      props: { stock: mockStock },
    });

    await wrapper.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("click");
    expect(wrapper.emitted("click")![0]).toEqual(["AAPL"]);
  });
});
