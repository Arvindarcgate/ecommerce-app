import request from "supertest";
import express from "express";
import { updateProduct, deleteProduct } from "../controllers/adminedit";

import { Product } from "../models/adminproduct";

// Mock Product model
jest.mock("../models/adminproduct", () => ({
    Product: {
        query: jest.fn(),
    },
}));

const app = express();
app.use(express.json());

// Routes for testing
app.put("/product/:id", (req: any, res) => updateProduct(req, res));
app.delete("/product/:id", (req: any, res) => deleteProduct(req, res));

describe("Product Controller Tests", () => {
    let mockQuery: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup base structure for Product.query()
        mockQuery = {
            findById: jest.fn().mockReturnThis(),
            patch: jest.fn().mockReturnThis(),
            returning: jest.fn(),
            deleteById: jest.fn(),
        };

        (Product.query as jest.Mock).mockReturnValue(mockQuery);
    });

    // ============================================================
    // 🟦 UPDATE PRODUCT TESTS
    // ============================================================
    test("✅ Should update product successfully", async () => {
        const updatedProductMock = {
            id: 1,
            name: "New Name",
            price: 500,
            size: "M",
            image: "/uploads/new.jpg",
        };

        mockQuery.returning.mockResolvedValue(updatedProductMock);

        const response = await request(app)
            .put("/product/1")
            .send({
                name: "New Name",
                price: "500",
                size: "M",
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("✅ Product updated successfully");
        expect(response.body.product).toEqual(updatedProductMock);
    });

    test("❌ Should return 404 when product not found", async () => {
        mockQuery.returning.mockResolvedValue(null);

        const response = await request(app)
            .put("/product/99")
            .send({
                name: "Test",
                price: "200",
                size: "L",
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("❌ Product not found");
    });

    test("❌ Should return 500 on update error", async () => {
        mockQuery.returning.mockRejectedValue(new Error("DB Error"));

        const response = await request(app)
            .put("/product/1")
            .send({
                name: "Error",
                price: "100",
                size: "S",
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Server Error");
        expect(response.body.error).toBe("DB Error");
    });

    // ============================================================
    // 🟥 DELETE PRODUCT TESTS
    // ============================================================
    test("🗑️ Should delete product successfully", async () => {
        mockQuery.deleteById.mockResolvedValue(1);

        const response = await request(app).delete("/product/1");

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("🗑️ Product deleted successfully");
    });

    test("❌ Should return 404 when deleting non-existing product", async () => {
        mockQuery.deleteById.mockResolvedValue(0);

        const response = await request(app).delete("/product/999");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("❌ Product not found");
    });

    test("❌ Should return 500 on delete error", async () => {
        mockQuery.deleteById.mockRejectedValue(new Error("Delete Failed"));

        const response = await request(app).delete("/product/1");

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Server Error");
        expect(response.body.error).toBe("Delete Failed");
    });
});
