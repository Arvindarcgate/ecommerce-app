import { Request, Response } from 'express';
import { createOrder, getAllOrders } from '../controllers/ordercontroller';
import { db } from '../db/db';

jest.mock('../db/db', () => ({
  db: jest.fn(),
}));

const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('Order Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          totalAmount: 100,
          discountAmount: 10,
          finalAmount: 90,
          couponCode: 'SAVE10',
          items: [
            {
              product_id: 1,
              name: 'Product A',
              quantity: 2,
              price: 50,
              total: 100,
            },
          ],
        },
      } as Request;

      const res = mockResponse();

      (db as any).mockImplementation((table: string) => {
        if (table === 'orders') {
          return {
            insert: jest.fn().mockResolvedValue([1]),
          };
        }
        if (table === 'order_items') {
          return {
            insert: jest.fn().mockResolvedValue(true),
          };
        }
      });

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order placed successfully',
        orderId: 1,
      });
    });

    it('should return 400 for invalid order data', async () => {
      const req = {
        body: {
          email: '',
          items: [],
        },
      } as Request;

      const res = mockResponse();

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid order data',
      });
    });

    it('should return 400 if finalAmount is missing', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          items: [{ product_id: 1 }],
        },
      } as Request;

      const res = mockResponse();

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Final amount is required',
      });
    });

    it('should return 400 if discount calculation is wrong', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          totalAmount: 100,
          discountAmount: 10,
          finalAmount: 95,
          items: [{ product_id: 1 }],
        },
      } as Request;

      const res = mockResponse();

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid discount calculation',
      });
    });

    it('should return 500 if database fails', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          totalAmount: 100,
          discountAmount: 0,
          finalAmount: 100,
          items: [{ product_id: 1 }],
        },
      } as Request;

      const res = mockResponse();

      (db as any).mockImplementation(() => ({
        insert: jest.fn().mockRejectedValue(new Error('DB Error')),
      }));

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Server error while placing order',
        })
      );
    });
  });

  describe('getAllOrders', () => {
    it('should return orders with items', async () => {
      const req = {
        query: {},
      } as Request;

      const res = mockResponse();

      const mockRows = [
        {
          id: 1,
          email: 'test@example.com',
          total_amount: 100,
          discount_amount: 10,
          final_amount: 90,
          coupon_code: 'SAVE10',
          created_at: new Date(),
          product: 'Product A',
          quantity: 2,
          item_total: 100,
        },
      ];

      (db as any).mockImplementation(() => ({
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue(mockRows),
      }));

      await getAllOrders(req, res);

      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          email: 'test@example.com',
          total_amount: 100,
          discount_amount: 10,
          final_amount: 90,
          coupon_code: 'SAVE10',
          created_at: mockRows[0].created_at,
          items: [
            {
              product: 'Product A',
              quantity: 2,
              item_total: 100,
            },
          ],
        },
      ]);
    });

    it('should return 500 on db error', async () => {
      const req = {
        query: {},
      } as Request;

      const res = mockResponse();

      (db as any).mockImplementation(() => {
        throw new Error('DB Error');
      });

      await getAllOrders(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to fetch orders',
      });
    });
  });
});
