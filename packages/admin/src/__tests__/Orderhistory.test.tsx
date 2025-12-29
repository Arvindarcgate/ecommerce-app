import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrderHistory from '../pages/orderhistory';

jest.mock('../pages/orderhistory.module.css', () => ({}));

jest.mock('../config/env', () => ({
  API_BASE_URL: 'http://localhost:8000',
}));

const mockOrders = [
  {
    id: 1,
    email: 'user1@test.com',
    total_amount: '100',
    discount_amount: '10',
    final_amount: '90',
    coupon_code: 'SAVE10',
    created_at: '2024-01-01T10:00:00Z',
    items: [
      {
        product: 'Product A',
        quantity: 2,
        item_total: '100',
      },
    ],
  },
  {
    id: 2,
    email: 'user2@test.com',
    total_amount: '200',
    discount_amount: '0',
    final_amount: '200',
    coupon_code: null,
    created_at: '2024-01-02T10:00:00Z',
    items: [
      {
        product: 'Product B',
        quantity: 1,
        item_total: '200',
      },
    ],
  },
];

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockOrders),
  } as any);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('OrderHistory Component', () => {
  it('should fetch and render orders on load', async () => {
    render(<OrderHistory />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/orders/all'
      );
    });

    expect(await screen.findByText('user1@test.com')).toBeInTheDocument();
    expect(screen.getByText('user2@test.com')).toBeInTheDocument();
    expect(screen.getByText(/Final: ₹90/i)).toBeInTheDocument();
  });

  it('should filter orders by email when search is clicked', async () => {
    render(<OrderHistory />);

    await screen.findByText('user1@test.com');

    const input = screen.getByPlaceholderText('Filter by Email');
    fireEvent.change(input, { target: { value: 'user1@test.com' } });

    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/orders/all?email=user1@test.com'
      );
    });
  });

  it('should show "No orders found" when API returns empty array', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([]),
    });

    render(<OrderHistory />);

    expect(await screen.findByText('No orders found')).toBeInTheDocument();
  });

  it('should render product details correctly', async () => {
    render(<OrderHistory />);

    expect(await screen.findByText(/Product A/i)).toBeInTheDocument();
    expect(screen.getByText(/× 2 = ₹100/i)).toBeInTheDocument();
  });

  it('should show discount only when discount_amount > 0', async () => {
    render(<OrderHistory />);

    expect(await screen.findByText(/Discount: −₹10/i)).toBeInTheDocument();
    expect(screen.queryByText(/Discount: −₹0/i)).not.toBeInTheDocument();
  });

  it('should render coupon code when available', async () => {
    render(<OrderHistory />);

    expect(await screen.findByText(/Coupon:/i)).toBeInTheDocument();
    expect(screen.getByText('SAVE10')).toBeInTheDocument();
  });

  it('should paginate orders correctly', async () => {
    const manyOrders = Array.from({ length: 15 }).map((_, i) => ({
      ...mockOrders[0],
      id: i + 1,
      email: `user${i}@test.com`,
      created_at: new Date(Date.now() + i).toISOString(),
    }));

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(manyOrders),
    });

    render(<OrderHistory />);

    expect(await screen.findByText('Page 1 of 2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Next ▶'));
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('◀ Prev'));
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });
});
