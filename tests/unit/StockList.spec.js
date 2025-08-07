import { mount, flushPromises } from '@vue/test-utils';
import StockList from '../../src/views/StockList.vue';
import StockCard from '../../src/components/StockCard.vue';
import api from '../../src/services/axios';
import { createRouter, createMemoryHistory } from 'vue-router';
import { vi } from 'vitest';

// ✅ Mock the API module
vi.mock('../../src/services/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

// ✅ Dummy stock data
const mockStocks = [
  {
    symbol: 'AAPL',
    description: 'Apple Inc.',
    mic: 'XNAS',
  },
  {
    symbol: 'GOOGL',
    description: 'Alphabet Inc.',
    mic: 'XNAS',
  },
  {
    symbol: 'TSLA',
    description: 'Tesla Inc.',
    mic: 'XNAS',
  },
  {
    symbol: 'BABA',
    description: 'Alibaba Group',
    mic: 'XNYS',
  },
];

describe('StockList.vue', () => {
  let router;

  beforeEach(() => {
    // ✅ Reset mocks before each test
    api.get.mockReset();

    // ✅ Create router with a mock route
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/stock/:symbol',
          name: 'StockDetail',
          component: { template: '<div>Mock Detail Page</div>' },
        },
      ],
    });
  });

  it('fetches and displays stocks grouped by MIC', async () => {
    api.get.mockResolvedValueOnce({ data: mockStocks });

    const wrapper = mount(StockList, {
      global: {
        plugins: [router],
      },
    });

    await flushPromises();

    // Assert all stock cards are rendered
    const cards = wrapper.findAllComponents(StockCard);
    expect(cards.length).toBe(3);

    // Assert MIC tabs are displayed
    const micButtons = wrapper.findAll('button');
    expect(micButtons.length).toBe(2); // XNAS and XNYS
    expect(wrapper.text()).toContain('XNAS');
    expect(wrapper.text()).toContain('XNYS');
  });

  it('filters stocks by search input', async () => {
    api.get.mockResolvedValueOnce({ data: mockStocks });

    const wrapper = mount(StockList, {
      global: {
        plugins: [router],
      },
    });

    await flushPromises();

    // Simulate user typing "Apple"
    const input = wrapper.find('input');
    await input.setValue('Apple');

    const cards = wrapper.findAllComponents(StockCard);
    expect(cards.length).toBe(1);
    expect(cards[0].text()).toContain('Apple Inc.');
  });

  it('displays loader while fetching', async () => {
    // Keep the promise pending
    let resolvePromise;
    const mockPromise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    api.get.mockReturnValueOnce(mockPromise);

    const wrapper = mount(StockList, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.html()).toContain('animate-bounce');

    resolvePromise({ data: mockStocks });
    await flushPromises();
  });

  it('navigates to detail page on stock card click', async () => {
    api.get.mockResolvedValueOnce({ data: mockStocks });
    const routerPush = vi.spyOn(router, 'push');

    const wrapper = mount(StockList, {
      global: {
        plugins: [router],
      },
    });

    await router.isReady();
    await flushPromises();

    const card = wrapper.findComponent(StockCard);
    await card.trigger('click');

    expect(routerPush).toHaveBeenCalledWith({
      name: 'StockDetail',
      params: { symbol: 'AAPL' },
    });
  });
});
