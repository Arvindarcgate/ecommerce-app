import request from 'supertest';
import express from 'express';
import { createOrder, getAllOrders } from '../controllers/ordercontroller';
import { db } from '../db/db';

jest.mock('../db/db', () => ({
  db: jest.fn(),
}));

const app = express();
app.use(express.json());

app.post('/orders', createOrder);
app.get('/orders', getAllOrders);

describe('Order Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 for invalid order body', async () => {
    const res = await request(app).post('/orders').send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid order data' });
  });

  it('should create order successfully', async () => {
    const mockInsertOrder = jest.fn().mockResolvedValue([1]);
    const mockInsertItems = jest.fn().mockResolvedValue([1]);

    (db as any).mockImplementation((table: string) => {
      if (table === 'orders') return { insert: mockInsertOrder };
      if (table === 'order_items') return { insert: mockInsertItems };
      return { insert: jest.fn() };
    });

    const res = await request(app)
      .post('/orders')
      .send({
        email: 'test@example.com',
        items: [
          {
            product_id: 1,
            name: 'Product 1',
            quantity: 2,
            price: 100,
            total: 200,
          },
        ],
        totalAmount: 200,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', ' Order placed successfully');
    expect(res.body).toHaveProperty('orderId', 1);
    expect(mockInsertOrder).toHaveBeenCalled();
    expect(mockInsertItems).toHaveBeenCalled();
  });

  it('should return 500 if creating order fails', async () => {
    const mockInsertOrder = jest.fn().mockRejectedValue(new Error('DB error'));

    (db as any).mockImplementation((table: string) => {
      if (table === 'orders') return { insert: mockInsertOrder };
      return { insert: jest.fn() };
    });

    const res = await request(app)
      .post('/orders')
      .send({
        email: 'test@example.com',
        items: [
          {
            product_id: 1,
            name: 'Product 1',
            quantity: 1,
            price: 100,
            total: 100,
          },
        ],
        totalAmount: 100,
      });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty(
      'message',
      'Server error while placing order'
    );
  });

  it('should fetch all orders without filter', async () => {
    const mockData = [
      {
        id: 1,
        email: 'test@example.com',
        total_amount: 200,
        created_at: new Date(),
        product: 'Product 1',
        quantity: 2,
        item_total: 200,
      },
    ];

    const chainMock = {
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      then: jest.fn((cb) => cb(mockData)),
    };

    (db as any).mockReturnValue(chainMock);

    const res = await request(app).get('/orders');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe(1);
    expect(res.body[0].items[0].product).toBe('Product 1');
  });

  it('should fetch orders filtered by email', async () => {
    const mockData = [
      {
        id: 2,
        email: 'filter@example.com',
        total_amount: 100,
        created_at: new Date(),
        product: 'Product A',
        quantity: 1,
        item_total: 100,
      },
    ];

    const chainMock = {
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      then: jest.fn((cb) => cb(mockData)),
    };

    (db as any).mockReturnValue(chainMock);

    const res = await request(app)
      .get('/orders')
      .query({ email: 'filter@example.com' });

    expect(res.status).toBe(200);
    expect(res.body[0].email).toBe('filter@example.com');
  });

  it('should return 500 when DB fails in getAllOrders', async () => {
    (db as any).mockImplementation(() => {
      throw new Error('DB failure');
    });

    const res = await request(app).get('/orders');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Failed to fetch orders');
  });
});
