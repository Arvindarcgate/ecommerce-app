import request from 'supertest';
import express, { Request, Response } from 'express';
import { subscribe } from '../controllers/newsletter.controller';
import { db } from '../db/db';

jest.mock('../db/db', () => ({
  db: jest.fn(() => ({
    insert: jest.fn(),
  })),
}));

const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next) => {
  (req as any).user = { id: 1 };
  next();
});

app.post('/subscribe', subscribe);

describe('Subscribe Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app).post('/subscribe').send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Email is required' });
  });

  it('should return 401 if user is not authenticated', async () => {
    const appNoUser = express();
    appNoUser.use(express.json());
    appNoUser.post('/subscribe', subscribe);

    const res = await request(appNoUser)
      .post('/subscribe')
      .send({ email: 'test@example.com' });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Unauthorized' });
  });

  it('should subscribe successfully', async () => {
    (db as any).mockReturnValue({ insert: jest.fn().mockResolvedValue(1) });

    const res = await request(app)
      .post('/subscribe')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'Subscribed successfully' });
    expect(db).toHaveBeenCalledWith('subscribers');
  });

  it('should return 500 if db insert fails', async () => {
    (db as any).mockReturnValue({
      insert: jest.fn().mockRejectedValue(new Error('DB error')),
    });

    const res = await request(app)
      .post('/subscribe')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Something went wrong' });
  });
});
