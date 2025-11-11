// packages/backend/src/controllers/adminProductpage.ts
import { Request, Response } from 'express';
import { Product } from '../models/adminproduct';

export const addProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, size } = req.body;
        const imageFile = req.file;

        if (!name || !price || !size || !imageFile) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const imagePath = `/uploads/${imageFile.filename}`;

        const product = await Product.query().insert({
            name,
            price: Number(price),
            size,
            image: imagePath,
        });
        res.status(201).json({
            message: '✅ Product added successfully',
            product,
        });
    } catch (error: any) {
        console.error('❌ Error adding product:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};








export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.query();
        res.status(200).json(products);
    } catch (error: any) {
        console.error('❌ Error fetching products:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
