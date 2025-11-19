
import request from "supertest";
import express from "express";
import knex from "../db/Knex";
import { createOrder, getAllOrders } from "../controllers/ordercontroller";

jest.mock("../db/Knex");

// Create express app for testing routes
const app = express();
app.use(express.json());
app.post("/orders", createOrder);
app.get("/orders", getAllOrders);

describe("Order Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ============================================================
    // ✅ TEST 1: CREATE ORDER → INVALID BODY
    // ============================================================
    it("should return 400 for invalid order data", async () => {
        const res = await request(app)
            .post("/orders")
            .send({ email: "test@test.com", items: [] });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid order data");
    });

    // ============================================================
    // ✅ TEST 2: CREATE ORDER SUCCESS
    // ============================================================
    it("should create an order successfully", async () => {
        // Mock knex insert return id = 1
        (knex as any).mockReturnValue({
            insert: jest.fn().mockResolvedValue([1])
        });

        const res = await request(app)
            .post("/orders")
            .send({
                email: "test@example.com",
                totalAmount: 1500,
                items: [
                    {
                        product_id: 10,
                        name: "Product A",
                        quantity: 2,
                        price: 500,
                        total: 1000,
                    },
                ],
            });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("✅ Order placed successfully");
        expect(res.body.orderId).toBe(1);
    });

    // ============================================================
    // ✅ TEST 3: CREATE ORDER ERROR (DB FAIL)
    // ============================================================
    it("should return 500 if DB throws error", async () => {
        (knex as any).mockReturnValue({
            insert: jest.fn().mockRejectedValue(new Error("DB error"))
        });

        const res = await request(app)
            .post("/orders")
            .send({
                email: "error@test.com",
                items: [{ product_id: 10 }],
                totalAmount: 100
            });

        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Server error while placing order");
    });

    // ============================================================
    // ✅ TEST 4: GET ALL ORDERS SUCCESS
    // ============================================================
    it("should return all orders", async () => {
        const mockRows = [
            {
                id: 1,
                email: "test@example.com",
                total_amount: 1500,
                created_at: "2025-01-01",
                product: "Product A",
                quantity: 2,
                item_total: 500,
            },
            {
                id: 1,
                email: "test@example.com",
                total_amount: 1500,
                created_at: "2025-01-01",
                product: "Product B",
                quantity: 1,
                item_total: 1000,
            }
        ];

        const mockQuery = {
            select: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
        };

        (mockQuery as any).then = jest.fn(cb => cb(mockRows));

        (knex as any).mockReturnValue(mockQuery);

        const res = await request(app).get("/orders");

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);

        const order = res.body[0];
        expect(order.items.length).toBe(2);
    });

    // ============================================================
    // ✅ TEST 5: GET ORDERS BY EMAIL
    // ============================================================
    it("should filter orders by email", async () => {
        const mockQuery = {
            select: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
        };

        (mockQuery as any).then = jest.fn(cb =>
            cb([
                {
                    id: 3,
                    email: "filter@test.com",
                    total_amount: 1000,
                    created_at: "2025-02-01",
                    product: "Item X",
                    quantity: 1,
                    item_total: 1000,
                }
            ])
        );

        (knex as any).mockReturnValue(mockQuery);

        const res = await request(app).get("/orders?email=filter@test.com");

        expect(mockQuery.where).toHaveBeenCalledWith(
            "o.email",
            "filter@test.com"
        );

        expect(res.body[0].email).toBe("filter@test.com");
    });

    // ============================================================
    // ✅ TEST 6: GET ORDERS DB ERROR
    // ============================================================
    it("should return 500 when DB throws error while fetching", async () => {
        const mockQuery = {
            select: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            then: jest.fn().mockRejectedValue(new Error("DB FAILURE")),
        };

        (knex as any).mockReturnValue(mockQuery);

        const res = await request(app).get("/orders");

        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Failed to fetch orders");
    });
});
