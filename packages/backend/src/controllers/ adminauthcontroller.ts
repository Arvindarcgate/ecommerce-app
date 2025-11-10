
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/db'; // your knex or db connection

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const registerAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // check if admin exists
        const existingAdmin = await db('admins').where({ email }).first();
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db('admins').insert({ email, password: hashedPassword });
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const admin = await db('admins').where({ email }).first();
        if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
