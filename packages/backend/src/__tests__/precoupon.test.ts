import { applyCouponHandler } from '../controllers/precoupon.controller';
import { applyCoupon } from '../service/coupon.service';
import { Request, Response } from 'express';

jest.mock('../service/coupon.service');

describe('applyCouponHandler', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if request data is invalid', async () => {
    req = {
      body: {
        code: '',
        cartAmount: 0,
      },
    };

    await applyCouponHandler(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      valid: false,
      reason: 'Invalid request data',
    });
  });

  it('should return 400 if coupon is invalid', async () => {
    req = {
      body: {
        code: 'INVALID10',
        cartAmount: 500,
      },
    };

    (applyCoupon as jest.Mock).mockResolvedValue({
      valid: false,
      reason: 'Coupon not found',
    });

    await applyCouponHandler(req as Request, res as Response);

    expect(applyCoupon).toHaveBeenCalledWith('INVALID10', 500);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      valid: false,
      reason: 'Coupon not found',
    });
  });

  it('should return 200 if coupon is valid and discount is applied', async () => {
    req = {
      body: {
        code: 'SAVE10',
        cartAmount: 1000,
      },
    };

    (applyCoupon as jest.Mock).mockResolvedValue({
      valid: true,
      discountAmount: 100,
      finalAmount: 900,
    });

    await applyCouponHandler(req as Request, res as Response);

    expect(applyCoupon).toHaveBeenCalledWith('SAVE10', 1000);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      valid: true,
      discountAmount: 100,
      finalAmount: 900,
    });
  });

  it('should return 500 if service throws error', async () => {
    req = {
      body: {
        code: 'SAVE10',
        cartAmount: 1000,
      },
    };

    (applyCoupon as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    await applyCouponHandler(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      valid: false,
      reason: 'Internal server error',
    });
  });
});
