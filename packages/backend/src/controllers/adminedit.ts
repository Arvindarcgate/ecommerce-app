
import { Request, Response } from "express";
import { Product } from "../models/adminproduct";

// ✅ Update Product
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, price, size } = req.body;
        const imageFile = req.file;

        // Prepare image path if new image is uploaded
        const imagePath = imageFile ? `/uploads/${imageFile.filename}` : undefined;

        const updatedProduct = await Product.query()
            .findById(id)
            .patch({
                name,
                price: Number(price),
                size,
                ...(imagePath && { image: imagePath }), // only update if image exists
            })
            .returning("*");

        if (!updatedProduct) {
            return res.status(404).json({ message: "❌ Product not found" });
        }

        res.status(200).json({
            message: "✅ Product updated successfully",
            product: updatedProduct,
        });
    } catch (error: any) {
        console.error("❌ Error updating product:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 🗑️ Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleted = await Product.query().deleteById(id);
        if (!deleted) {
            return res.status(404).json({ message: "❌ Product not found" });
        }

        res.status(200).json({ message: "🗑️ Product deleted successfully" });
    } catch (error: any) {
        console.error("❌ Error deleting product:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
