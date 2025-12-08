import request from "supertest";
import express from "express";
import { createOrder, getAllOrders } from "../controllers/ordercontroller";
import { db } from "../db/db";

jest.mock("../db/db");

const app = express();
app.use(express.json());
app.post("/orders", createOrder);
app.get("/orders", getAllOrders);

describe("createOrder", () => {
  it("should return 400 for invalid data", async () => {
    const res = await request(app).post("/orders").send({
      email: "",
      items: []
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid order data");
  });

  it("should create order successfully", async () => {
    (db.insert as jest.Mock).mockResolvedValueOnce([1]);
    (db.insert as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app).post("/orders").send({
      email: "test@example.com",
      totalAmount: 100,
      items: [
        {
          product_id: 1,
          name: "Item",
          quantity: 2,
          price: 50,
          total: 100
        }
      ]
    });

    expect(res.status).toBe(201);
    expect(res.body.orderId).toBe(1);
  });

  it("should return 500 on database error", async () => {
    (db.insert as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await request(app).post("/orders").send({
      email: "test@example.com",
      totalAmount: 100,
      items: [
        {
          product_id: 1,
          name: "Item",
          quantity: 1,
          price: 100,
          total: 100
        }
      ]
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Server error while placing order");
  });
});

describe("getAllOrders", () => {
  it("should return grouped orders", async () => {
    (db.orderBy as jest.Mock).mockResolvedValue([
      {
        id: 1,
        email: "user@example.com",
        total_amount: 200,
        created_at: "2024-01-01",
        product: "Product A",
        quantity: 1,
        item_total: 100
      },
      {
        id: 1,
        email: "user@example.com",
        total_amount: 200,
        created_at: "2024-01-01",
        product: "Product B",
        quantity: 1,
        item_total: 100
      }
    ]);

    const res = await request(app).get("/orders");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].items.length).toBe(2);
  });

  it("should filter by email", async () => {
    (db.orderBy as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get("/orders?email=test@example.com");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 500 on error", async () => {
    (db.leftJoin as jest.Mock).mockImplementation(() => {
      throw new Error("DB fail");
    });

    const res = await request(app).get("/orders");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Failed to fetch orders");
  });
});
