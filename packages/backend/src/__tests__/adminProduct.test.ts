
import request from "supertest";
import app from "../server";
import { Product } from "../models/adminproduct";

// Mock Product Model
jest.mock("../models/adminproduct", () => ({
    Product: {
        query: jest.fn().mockReturnThis(),
        findById: jest.fn().mockReturnThis(),
        patch: jest.fn().mockReturnThis(),
        deleteById: jest.fn(),
        returning: jest.fn().mockReturnThis(),
    },
}));

describe("Admin Product Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ====================================================
    // ✅ TEST 1: UPDATE PRODUCT - SUCCESS
    // ====================================================
    test("should update a product successfully", async () => {
        const mockUpdated = {
            id: 1,
            name: "Updated Shirt",
            price: 150,
            size: "M",
            image: "/uploads/sample.jpg",
        };

        (Product.patch as any).mockReturnValue({
            returning: jest.fn().mockResolvedValue(mockUpdated),
        });

        const res = await request(app)
            .put("/api/products/update/1")
            .field("name", "Updated Shirt")
            .field("price", "150")
            .field("size", "M");

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("✅ Product updated successfully");
        expect(res.body.product).toEqual(mockUpdated);
    });


    test("should return 404 if product not found", async () => {
        (Product.patch as any).mockReturnValue({
            returning: jest.fn().mockResolvedValue(null),
        });

        const res = await request(app)
            .put("/api/products/update/99")
            .field("name", "Something")
            .field("price", "100")
            .field("size", "XL");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("❌ Product not found");
    });

    // ====================================================
    // 💥 TEST 3: UPDATE PRODUCT - SERVER ERROR
    // ====================================================
    test("should return 500 if update throws error", async () => {
        (Product.patch as any).mockImplementation(() => {
            throw new Error("DB ERROR");
        });

        const res = await request(app)
            .put("/api/products/update/1")
            .field("name", "Test")
            .field("price", "100");

        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Server Error");
    });

    // ====================================================
    // 🗑️ TEST 4: DELETE PRODUCT - SUCCESS
    // ====================================================
    test("should delete a product successfully", async () => {
        (Product.deleteById as any).mockResolvedValue(1);

        const res = await request(app).delete("/api/products/delete/1");

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("🗑️ Product deleted successfully");
    });

    // ====================================================
    // ❌ TEST 5: DELETE PRODUCT - NOT FOUND
    // ====================================================
    test("should return 404 when deleting non-existing product", async () => {
        (Product.deleteById as any).mockResolvedValue(0);

        const res = await request(app).delete("/api/products/delete/999");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("❌ Product not found");
    });

    // ====================================================
    // 💥 TEST 6: DELETE PRODUCT - SERVER ERROR
    // ====================================================
    test("should return 500 on delete error", async () => {
        (Product.deleteById as any).mockRejectedValue(new Error("DB FAIL"));

        const res = await request(app).delete("/api/products/delete/1");

        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Server Error");
    });
});
