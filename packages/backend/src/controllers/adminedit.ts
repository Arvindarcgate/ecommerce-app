import { Request, Response } from "express";
import { Product } from "../models/adminproduct";

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, price, size } = req.body;
        const imageFile = req.file;

 
        const imagePath = imageFile ? `/uploads/${imageFile.filename}` : undefined;

        const updatedProduct = await Product.query()
            .findById(id)
            .patch({
                name,
                price: Number(price),
                size,
                ...(imagePath && { image: imagePath }), 
            })
            .returning("*");

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: " Product updated successfully",
            product: updatedProduct,
        });
    } catch (error: any) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log("DELETE API HIT — ID RECEIVED FROM FRONTEND:", id);

        const deleted = await Product.query().deleteById(id);
        console.log("OBJECTION DELETE RESULT:", deleted);

        if (!deleted) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "🗑️ Product deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};