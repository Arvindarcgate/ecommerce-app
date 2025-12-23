import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CouponDataTable, { CouponTableItem } from './coupondatatable';

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
  },
}));

import toast from 'react-hot-toast';

const mockCoupons: CouponTableItem[] = [
  {
    id: 1,
    code: 'SAVE10',
    discount_type: 'PERCENTAGE',
    discount_value: 10,
    min_order_amount: 100,
    usage_limit_per_user: 1,
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'ACTIVE',
  },
  {
    id: 2,
    code: 'FLAT50',
    discount_type: 'FLAT',
    discount_value: 50,
    start_date: '2024-02-01',
    end_date: '2024-12-31',
    status: 'INACTIVE',
  },
];

describe('CouponDataTable', () => {
  test('shows empty state when no coupons', () => {
    render(
      <CouponDataTable coupons={[]} onEdit={jest.fn()} onDelete={jest.fn()} />
    );

    expect(screen.getByText('No coupons created yet')).toBeInTheDocument();
  });

  test('renders coupon data in table', () => {
    render(
      <CouponDataTable
        coupons={mockCoupons}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('SAVE10')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();

    expect(screen.getByText('FLAT50')).toBeInTheDocument();
    expect(screen.getByText('₹50')).toBeInTheDocument();

    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('INACTIVE')).toBeInTheDocument();
  });

  test('calls onEdit with correct coupon', () => {
    const onEdit = jest.fn();

    render(
      <CouponDataTable
        coupons={mockCoupons}
        onEdit={onEdit}
        onDelete={jest.fn()}
      />
    );

    fireEvent.click(screen.getAllByText('Edit')[0]);

    expect(onEdit).toHaveBeenCalledWith(mockCoupons[0]);
  });

  test('calls onDelete and shows success toast', () => {
    const onDelete = jest.fn();

    render(
      <CouponDataTable
        coupons={mockCoupons}
        onEdit={jest.fn()}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getAllByText('Delete')[0]);

    expect(onDelete).toHaveBeenCalledWith(1);
    expect(toast.success).toHaveBeenCalledWith('Coupon deleted successfully');
  });

  test('shows dash when optional fields are missing', () => {
    render(
      <CouponDataTable
        coupons={[mockCoupons[1]]}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    const dashes = screen.getAllByText('-');
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });
});
