import { Request, Response } from 'express';
import {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
} from '../controllers/coupon.controller';
import Coupon from '../models/coupon';


jest.mock('../models/coupon');

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as Response;
};

describe('Coupon Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  describe('createCoupon', () => {
    it('should create a coupon successfully', async () => {
      const req = {
        body: {
          code: 'SAVE10',
          discountType: 'PERCENT',
          discountValue: 10,
          minOrderAmount: 100,
          maxDiscount: 50,
          usageLimitPerUser: 1,
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          status: 'ACTIVE',
        },
      } as Request;

      const res = mockResponse();

      (Coupon.query as jest.Mock).mockReturnValue({
        insert: jest.fn().mockResolvedValue(req.body),
      });

      await createCoupon(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Coupon created successfully',
        })
      );
    });

    it('should return 500 if creation fails', async () => {
      const req = { body: {} } as Request;
      const res = mockResponse();

      (Coupon.query as jest.Mock).mockImplementation(() => {
        throw new Error('DB error');
      });

      await createCoupon(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to create coupon',
      });
    });
  });


  describe('getAllCoupons', () => {
    it('should fetch all coupons successfully', async () => {
      const req = {} as Request;
      const res = mockResponse();

      const coupons = [{ id: 1, code: 'SAVE10' }];

      (Coupon.query as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue(coupons),
      });

      await getAllCoupons(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: coupons,
      });
    });

    it('should return 500 if fetch fails', async () => {
      const req = {} as Request;
      const res = mockResponse();

      (Coupon.query as jest.Mock).mockImplementation(() => {
        throw new Error('DB error');
      });

      await getAllCoupons(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to fetch coupons',
      });
    });
  });

  describe('deleteCoupon', () => {
    it('should delete coupon successfully', async () => {
      const req = {
        params: { id: '1' },
      } as unknown as Request;

      const res = mockResponse();

      (Coupon.query as jest.Mock).mockReturnValue({
        deleteById: jest.fn().mockResolvedValue(1),
      });

      await deleteCoupon(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Coupon deleted successfully',
      });
    });

    it('should return 500 if delete fails', async () => {
      const req = {
        params: { id: '1' },
      } as unknown as Request;

      const res = mockResponse();

      (Coupon.query as jest.Mock).mockImplementation(() => {
        throw new Error('DB error');
      });

      await deleteCoupon(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to delete coupon',
      });
    });
  });
});
