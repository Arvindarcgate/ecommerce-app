import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CouponPage from './coupon';
import { API_BASE_URL } from '../../config/env';

jest.mock('../../config/env', () => ({
  API_BASE_URL: 'http://localhost:8000',
}));

jest.mock('@ecommerce/coupon', () => ({
  CouponForm: ({ onSubmit }: any) => (
    <button onClick={() => onSubmit(mockFormValues)}>Submit Coupon Form</button>
  ),
}));

jest.mock('./couponpreview', () => ({
  __esModule: true,
  default: ({ onConfirm, onDelete }: any) => (
    <div>
      <button onClick={() => onConfirm(mockFormValues)}>Confirm Coupon</button>
      <button onClick={onDelete}>Cancel Preview</button>
    </div>
  ),
}));

jest.mock('./coupondatatable', () => ({
  __esModule: true,
  default: ({ onEdit, onDelete }: any) => (
    <div>
      <button onClick={() => onEdit(mockTableItem)}>Edit Coupon</button>
      <button onClick={() => onDelete(1)}>Delete Coupon</button>
    </div>
  ),
}));

const mockCouponsResponse = {
  data: [
    {
      id: 1,
      code: 'SAVE10',
      discount_type: 'PERCENT',
      discount_value: 10,
      min_order_amount: 100,
      max_discount: 50,
      usage_limit_per_user: 1,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      status: 'ACTIVE',
    },
  ],
};

const mockFormValues = {
  code: 'SAVE10',
  discountType: 'PERCENT',
  discountValue: 10,
  minOrderAmount: 100,
  maxDiscount: 50,
  usageLimitPerUser: 1,
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  status: 'ACTIVE',
};

const mockTableItem = mockCouponsResponse.data[0];

describe('CouponPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockCouponsResponse,
    });
  });

  test('renders Create Coupon button', async () => {
    render(<CouponPage />);

    expect(await screen.findByText('+ Create Coupon')).toBeInTheDocument();
  });

  test('fetches coupons on mount', async () => {
    render(<CouponPage />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/api/coupons`);
    });
  });

  test('opens coupon form when Create Coupon is clicked', async () => {
    render(<CouponPage />);

    fireEvent.click(await screen.findByText('+ Create Coupon'));

    expect(screen.getByText('Submit Coupon Form')).toBeInTheDocument();
  });

  test('shows preview after form submission', async () => {
    render(<CouponPage />);

    fireEvent.click(await screen.findByText('+ Create Coupon'));
    fireEvent.click(screen.getByText('Submit Coupon Form'));

    expect(screen.getByText('Confirm Coupon')).toBeInTheDocument();
  });

  test('submits coupon and refreshes list', async () => {
    render(<CouponPage />);

    fireEvent.click(await screen.findByText('+ Create Coupon'));
    fireEvent.click(screen.getByText('Submit Coupon Form'));
    fireEvent.click(screen.getByText('Confirm Coupon'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/admin/coupons`,
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/api/coupons`);
  });

  test('opens form with values on edit', async () => {
    render(<CouponPage />);

    fireEvent.click(await screen.findByText('Edit Coupon'));

    expect(screen.getByText('Submit Coupon Form')).toBeInTheDocument();
  });

  test('calls delete API and refreshes list', async () => {
    render(<CouponPage />);

    fireEvent.click(await screen.findByText('Delete Coupon'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/api/coupons/1`, {
        method: 'DELETE',
      });
    });

    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/api/coupons`);
  });
});
