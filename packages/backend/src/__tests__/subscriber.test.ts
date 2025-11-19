
import request from "supertest";
import express from "express";
import { subscribe } from "../controllers/newsletter.controller";
import db from "../db/Knex";

// Mock DB
jest.mock("../db/Knex", () => ({
    __esModule: true,
    default: jest.fn(() => { }),
    insert: jest.fn(),
}));

const app = express();
app.use(express.json());

// Fake auth middleware for test
app.post("/subscribe", (req: any, res, next) => {
    req.user = req.headers["user-id"] ? { id: req.headers["user-id"] } : null;
    next();
}, subscribe);

describe("POST /subscribe", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ----------------------------------------------------
    test("❌ Should return 400 if email is missing", async () => {
        const response = await request(app)
            .post("/subscribe")
            .set("user-id", "1") // Mock user
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Email is required");
    });

    // ----------------------------------------------------
    test("❌ Should return 401 if user is unauthorized", async () => {
        const response = await request(app)
            .post("/subscribe")
            .send({ email: "test@example.com" });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
    });

    // ----------------------------------------------------
    test("✅ Should subscribe user successfully", async () => {
        (db as any).mockReturnValueOnce({
            insert: jest.fn().mockResolvedValueOnce([1])
        });

        const response = await request(app)
            .post("/subscribe")
            .set("user-id", "10")
            .send({ email: "user@example.com" });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Subscribed successfully");

        expect(db).toHaveBeenCalledWith("subscribers");
    });

    // ----------------------------------------------------
    test("❌ Should return 500 on database error", async () => {
        (db as any).mockReturnValueOnce({
            insert: jest.fn().mockRejectedValueOnce(new Error("DB Error"))
        });

        const response = await request(app)
            .post("/subscribe")
            .set("user-id", "5")
            .send({ email: "error@example.com" });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Something went wrong");
    });

});
