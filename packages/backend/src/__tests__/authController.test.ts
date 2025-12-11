import { signup, verifyEmail, login } from '../controllers/auth';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

jest.mock('../models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('crypto');

const mockReq = () => ({ body: {}, query: {}, params: {} } as any);

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Auth Controller - Signup', () => {
  test('Signup → success', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = { email: 'a@test.com', password: '123456', role: 'user' };

    (User.query as any).mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null), // No existing user
      insert: jest.fn().mockResolvedValue({
        id: 1,
        email: 'a@test.com',
        role: 'user',
        verification_token: 'fake_token_123',
      }),
    });

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pwd');
    (crypto.randomBytes as jest.Mock).mockReturnValue({
      toString: () => 'fake_token_123',
    });

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Signup successful!',
        verificationLink:
          'http://localhost:5173/verify-email?token=fake_token_123',
      })
    );
  });

  test('Signup → email exists', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = { email: 'a@test.com', password: '123456' };

    (User.query as any).mockReturnValue({
      findOne: jest.fn().mockResolvedValue({ id: 999 }), // Existing user
    });

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email already exists',
    });
  });

  test('Signup → DB error', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = { email: 'a@test.com', password: '123456' };

    (User.query as any).mockReturnValue({
      findOne: jest.fn().mockRejectedValue(new Error('DB broke')),
    });

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Server error',
    });
  });
});

describe('Auth Controller - Verify Email', () => {
  test('Verify Email → success', async () => {
    const req = mockReq();
    const res = mockRes();

    req.query = { token: 'abc123' };

    (User.query as any).mockReturnValue({
      findOne: jest.fn().mockResolvedValue({ id: 1 }),
      findById: jest.fn().mockReturnValue({
        patch: jest.fn().mockResolvedValue(true),
      }),
    });

    await verifyEmail(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Email verified successfully! You can now login.',
    });
  });

  test('Verify Email → invalid token', async () => {
    const req = mockReq();
    const res = mockRes();

    req.query = { token: 'abc123' };

    (User.query as any).mockReturnValue({
      findOne: jest.fn().mockResolvedValue(undefined),
    });

    await verifyEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid token',
    });
  });

  test('Verify Email → DB error', async () => {
    const req = mockReq();
    const res = mockRes();

    req.query = { token: 'abc123' };

    (User.query as any).mockReturnValue({
      findOne: jest.fn().mockRejectedValue(new Error('DB Error')),
    });

    await verifyEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('Auth Controller - Login', () => {
  test('Login → success', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = { email: 'a@test.com', password: '123456' };

    (User.query as any).mockReturnValue({
      findOne: jest.fn().mockResolvedValue({
        id: 1,
        email: 'a@test.com',
        role: 'user',
        password: 'hashedpwd',
      }),
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    (jwt.sign as jest.Mock)
      .mockReturnValueOnce('access_token')
      .mockReturnValueOnce('refresh_token');

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Login successful',
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      })
    );
  });

  test('Login → invalid credentials (no user)', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = { email: 'a@test.com', password: '123456' };

    (User.query as any).mockReturnValue({
      findOne: jest.fn().mockResolvedValue(undefined),
    });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('Login → DB error', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = { email: 'a@test.com', password: '123456' };

    (User.query as any).mockReturnValue({
      findOne: jest.fn().mockRejectedValue(new Error('DB Error')),
    });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
