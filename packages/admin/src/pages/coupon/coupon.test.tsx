import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CouponPage from './coupon';




jest.mock('../../config/env', () => ({
  API_BASE_URL: 'http://localhost:8000',
}));


jest.mock('@ecommerce/coupon', () => ({
  CouponForm: ({ onSubmit }: any) => (
    <button onClick={() => onSubmit(mockCouponFormValues)}>
      Submit Coupon Form
    </button>
  ),
}));


jest.mock('../pages/coupon/couponpreview', () => ({
  __esModule: true,
  default: ({ onConfirm }: any) => (
    <button onClick={() => onConfirm(mockCouponFormValues)}>
      Confirm Coupon
    </button>
  ),
}));

// CouponDataTable
jest.mock('../pages/coupon/coupondatatable', () => ({
  __esModule: true,
  default: ({ coupons, onEdit, onDelete }: any) => (
    <div>
      {coupons.map((c: any) => (
        <div key={c.id}>
          <span>{c.code}</span>
          <button onClick={() => onEdit(c)}>Edit</button>
          <button onClick={() => onDelete(c.id)}>Delete</button>
        </div>
      ))}
    </div>
  ),
}));

// -------------------- MOCK DATA --------------------

const mockCoupons = [
  {
    id: 1,
    code: 'SAVE10',
    discount_type: 'PERCENTAGE',
    discount_value: 10,
    min_order_amount: 100,
    max_discount: 50,
    usage_limit_per_user: 1,
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'ACTIVE',
  },
];

const mockCouponFormValues = {
  code: 'SAVE10',
  discountType: 'PERCENTAGE',
  discountValue: 10,
  minOrderAmount: 100,
  maxDiscount: 50,
  usageLimitPerUser: 1,
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  status: 'ACTIVE',
};

// -------------------- FETCH MOCK --------------------

beforeEach(() => {
  global.fetch = jest.fn()
    // GET coupons
    .mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ data: mockCoupons }),
      ok: true,
    } as any)
    // POST coupon
    .mockResolvedValueOnce({
      ok: true,
    } as any)
    // REFRESH coupons
    .mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ data: mockCoupons }),
      ok: true,
    } as any)
    // DELETE coupon
    .mockResolvedValueOnce({
      ok: true,
    } as any)
    // REFRESH coupons
    .mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ data: mockCoupons }),
      ok: true,
    } as any);
});

afterEach(() => {
  jest.resetAllMocks();
});

// -------------------- TESTS --------------------

describe('CouponPage', () => {
  it('fetches and displays coupons on mount', async () => {
    render(<CouponPage />);

    expect(await screen.findByText('SAVE10')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/coupons'
    );
  });

  it('shows loading state while fetching', async () => {
    render(<CouponPage />);
    expect(screen.getByText(/Loading coupons/i)).toBeInTheDocument();
  });

  it('opens coupon form when Create Coupon is clicked', async () => {
    render(<CouponPage />);

    fireEvent.click(await screen.findByText('+ Create Coupon'));
    expect(screen.getByText('Submit Coupon Form')).toBeInTheDocument();
  });

  it('submits coupon form and shows preview', async () => {
    render(<CouponPage />);

    fireEvent.click(await screen.findByText('+ Create Coupon'));
    fireEvent.click(screen.getByText('Submit Coupon Form'));

    expect(screen.getByText('Confirm Coupon')).toBeInTheDocument();
  });

  it('confirms coupon and sends POST request', async () => {
    render(<CouponPage />);

    fireEvent.click(await screen.findByText('+ Create Coupon'));
    fireEvent.click(screen.getByText('Submit Coupon Form'));
    fireEvent.click(screen.getByText('Confirm Coupon'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/admin/coupons',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  it('edits an existing coupon', async () => {
    render(<CouponPage />);

    fireEvent.click(await screen.findByText('Edit'));
    expect(screen.getByText('Submit Coupon Form')).toBeInTheDocument();
  });

  it('deletes a coupon', async () => {
    render(<CouponPage />);

    fireEvent.click(await screen.findByText('Delete'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/coupons/1',
        { method: 'DELETE' }
      );
    });
  });
});
