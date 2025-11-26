const mockQueryBuilder = {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
};

const mockKnex = jest.fn(() => mockQueryBuilder);

jest.mock("../db/Knex", () => ({
    __esModule: true,
    default: mockKnex,
}));

import { Request, Response } from "express";
import { createOrder, getAllOrders } from "../controllers/ordercontroller";

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("Order Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns 400 for invalid order data", async () => {
        const req = { body: {} } as Request;
        const res = mockResponse();

        await createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid order data" });
    });

    test("creates an order successfully", async () => {
        const req = {
            body: {
                email: "test@example.com",
                totalAmount: 1000,
                items: [
                    {
                        product_id: 1,
                        name: "Shirt",
                        quantity: 2,
                        price: 500,
                        total: 1000,
                    },
                ],
            },
        } as any;

        const res = mockResponse();

        mockQueryBuilder.insert.mockResolvedValueOnce([10]);
        mockQueryBuilder.insert.mockResolvedValueOnce({});

        await createOrder(req, res);

        expect(mockKnex).toHaveBeenCalledWith("orders");
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "✅ Order placed successfully",
            orderId: 10,
        });
    });

    test("returns 500 when DB fails to insert order", async () => {
        const req = {
            body: {
                email: "x@test.com",
                totalAmount: 500,
                items: [{ product_id: 1 }],
            },
        } as any;

        const res = mockResponse();

        mockQueryBuilder.insert.mockRejectedValueOnce(new Error("DB error"));

        await createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Server error while placing order",
            error: "DB error",
        });
    });

    test("returns all orders", async () => {
        const req = { query: {} } as any;
        const res = mockResponse();

        const fakeRows = [
            {
                id: 1,
                email: "user@test.com",
                total_amount: 999,
                created_at: "2025-01-01",
                product: "Shirt",
                quantity: 1,
                item_total: 999,
            },
        ];

        mockQueryBuilder.orderBy.mockResolvedValueOnce(fakeRows);

        await getAllOrders(req, res);

        expect(res.json).toHaveBeenCalledWith([
            {
                id: 1,
                email: "user@test.com",
                total_amount: 999,
                created_at: "2025-01-01",
                items: [
                    {
                        product: "Shirt",
                        quantity: 1,
                        item_total: 999,
                    },
                ],
            },
        ]);
    });

    test("filters orders by email", async () => {
        const req = { query: { email: "x@test.com" } } as any;
        const res = mockResponse();

        const rows = [
            {
                id: 2,
                email: "x@test.com",
                total_amount: 200,
                created_at: "2025-01-02",
                product: "Cap",
                quantity: 1,
                item_total: 200,
            },
        ];

        mockQueryBuilder.where.mockResolvedValueOnce(rows);

        await getAllOrders(req, res);

        expect(mockQueryBuilder.where).toHaveBeenCalledWith(
            "o.email",
            "x@test.com"
        );
    });

    test("returns 500 when failing to fetch orders", async () => {
        const req = { query: {} } as any;
        const res = mockResponse();

        mockQueryBuilder.orderBy.mockRejectedValueOnce(
            new Error("DB fetch error")
        );

        await getAllOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Failed to fetch orders",
        });
    });
});
