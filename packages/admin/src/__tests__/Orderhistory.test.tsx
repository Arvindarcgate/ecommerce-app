import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrderHistory from '../pages/orderhistory';
import { API_BASE_URL } from '../config/env';

jest.mock('../config/env', () => ({
  API_BASE_URL: 'http://localhost:8000',
}));

const mockOrders = [
  {
    id: 1,
    email: 'test@example.com',
    total_amount: '500',
    created_at: '2025-01-05T10:00:00Z',
    items: [
      { product: 'Shirt', quantity: 2, item_total: '300' },
      { product: 'Jeans', quantity: 1, item_total: '200' },
    ],
  },
  {
    id: 2,
    email: 'user@example.com',
    total_amount: '250',
    created_at: '2025-01-04T09:00:00Z',
    items: [{ product: 'Shoes', quantity: 1, item_total: '250' }],
  },
];

global.fetch = jest.fn();

describe('OrderHistory Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockOrders),
    });
  });

  test('renders heading', async () => {
    render(<OrderHistory />);

    expect(screen.getByText('Order History')).toBeInTheDocument();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  test('fetches and displays orders', async () => {
    render(<OrderHistory />);

    // Wait for fetch to complete
    await waitFor(() =>
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    );

    // Check product items
    expect(screen.getByText('Shirt')).toBeInTheDocument();
    expect(screen.getByText('Jeans')).toBeInTheDocument();
  });

  test('filters orders by email when Search is clicked', async () => {
    render(<OrderHistory />);

    const input = screen.getByPlaceholderText('Filter by Email');
    const button = screen.getByText('Search');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/orders/all?email=test@example.com`
      );
    });
  });

  test("shows 'No orders found' when list is empty", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([]),
    });

    render(<OrderHistory />);

    await waitFor(() =>
      expect(screen.getByText('No orders found')).toBeInTheDocument()
    );
  });

  test('pagination buttons work correctly', async () => {
    // Create 20 orders to test pagination
    const bigList = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      email: `user${i}@mail.com`,
      total_amount: '100',
      created_at: '2025-01-05T10:00:00Z',
      items: [{ product: 'Item', quantity: 1, item_total: '100' }],
    }));

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(bigList),
    });

    render(<OrderHistory />);

    await waitFor(() => {
      expect(screen.getByText('user0@mail.com')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('Next ▶');
    const prevButton = screen.getByText('◀ Prev');

    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();

    fireEvent.click(nextButton);

    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();

    fireEvent.click(prevButton);

    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });
});
