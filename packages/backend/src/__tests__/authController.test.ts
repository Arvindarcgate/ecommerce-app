// src/__tests__/authController.test.ts
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../server";
import { User } from "../models/User";

jest.mock("../models/User", () => ({
    User: {
        query: jest.fn(),
    },
}));

describe("Auth Controller API Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    test(" Signup should create a new user", async () => {
        (User.query as any).mockReturnValue({
            findOne: jest.fn().mockResolvedValue(null),
            insert: jest.fn().mockResolvedValue({
                id: 1,
                email: "newuser@example.com",
                role: "user",
                verification_token: "abcd123",
            }),
        });

        const res = await request(app)
            .post("/api/auth/signup")
            .send({ email: "newuser@example.com", password: "123456" });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Signup successful!");
        expect(res.body.user.email).toBe("newuser@example.com");
    });


    test("Signup should fail if email already exists", async () => {
        (User.query as any).mockReturnValue({
            findOne: jest.fn().mockResolvedValue({ email: "exists@example.com" }),
        });

        const res = await request(app)
            .post("/api/auth/signup")
            .send({ email: "exists@example.com", password: "123456" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Email already exists");
    });


    test("Login should return JWT tokens when credentials valid", async () => {
        const hashedPassword = await bcrypt.hash("123456", 10);

        (User.query as any).mockReturnValue({
            findOne: jest.fn().mockResolvedValue({
                id: 1,
                email: "test@example.com",
                password: hashedPassword,
                role: "user",
            }),
        });

        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@example.com", password: "123456" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Login successful");
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
    });

    test(" Login should fail for invalid credentials", async () => {
        (User.query as any).mockReturnValue({
            findOne: jest.fn().mockResolvedValue(null),
        });

        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "wrong@example.com", password: "wrongpass" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid credentials");
    });
});
