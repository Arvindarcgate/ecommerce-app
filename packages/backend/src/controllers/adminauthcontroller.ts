import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/db';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await db('admins').where({ email }).first();
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await db('admins').insert({
      name,
      email,
      password: hashedPassword,
    });

    const newAdmin = await db('admins')
      .where({ id: insertResult[0] })
      .select('id', 'email', 'name')
      .first();

    const token = jwt.sign(
      { id: newAdmin.id, email: newAdmin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      admin: newAdmin,
    });
  } catch (err) {
    console.error('Admin Register Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await db('admins').where({ email }).first();
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
