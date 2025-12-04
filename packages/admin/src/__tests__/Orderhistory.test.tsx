
import { render, screen } from '@testing-library/react';
import OrderHistory from '../pages/orderhistory';

jest.mock('../../config/env', () => ({
  API_BASE_URL: 'http://mock-api-url.com'
}));

test('renders without crash', () => {
  render(<OrderHistory />);
  expect(screen.getByText('Order History')).toBeInTheDocument();
});

global.fetch = jest.fn();

const mockOrders = [
  {
    id: 1,
    email: 'test@example.com',
    total_amount: '500',
    created_at: '2025-01-01T10:00:00Z',
    items: [
      { product: 'Product A', quantity: 2, item_total: '200' },
      { product: 'Product B', quantity: 1, item_total: '300' }
    ]
  }
];

const mockFetch = (data = mockOrders) => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    json: async () => data
  } as Response);
};

describe('OrderHistory Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders heading', async () => {
    mockFetch();
    render(<OrderHistory />);
    expect(screen.getByText(/Order History/i)).toBeInTheDocument();
  });

  test('fetches and displays orders', async () => {
    mockFetch();
    render(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    expect(screen.getByText('₹500')).toBeInTheDocument();
    expect(screen.getByText(/Product A/i)).toBeInTheDocument();
  });

  test('filters orders by email', async () => {
    mockFetch();
    render(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    mockFetch([]);
    fireEvent.change(screen.getByPlaceholderText(/Filter by Email/i), {
      target: { value: 'notfound@example.com' }
    });
    fireEvent.click(screen.getByText(/Search/i));

    await waitFor(() => {
      expect(screen.getByText(/No orders found/i)).toBeInTheDocument();
    });
  });

  test('pagination buttons work', async () => {
    const longList = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      email: 'test@example.com',
      total_amount: '100',
      created_at: '2025-01-01T10:00:00Z',
      items: []
    }));

    mockFetch(longList);
    render(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Next/i));

    await waitFor(() => {
      expect(screen.getByText('11')).toBeInTheDocument();
    });
  });
});
