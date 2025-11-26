// // src/__tests__/authController.test.ts
// import request from "supertest";
// import bcrypt from "bcrypt";
// import app from "../server";
// import { User } from "../models/User";

// jest.mock("../models/User", () => ({
//     User: {
//         query: jest.fn(),
//     },
// }));

// describe("Auth Controller API Tests", () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });


//     test(" Signup should create a new user", async () => {
//         (User.query as any).mockReturnValue({
//             findOne: jest.fn().mockResolvedValue(null),
//             insert: jest.fn().mockResolvedValue({
//                 id: 1,
//                 email: "newuser@example.com",
//                 role: "user",
//                 verification_token: "abcd123",
//             }),
//         });

//         const res = await request(app)
//             .post("/api/auth/signup")
//             .send({ email: "newuser@example.com", password: "123456" });

//         expect(res.status).toBe(201);
//         expect(res.body.message).toBe("Signup successful!");
//         expect(res.body.user.email).toBe("newuser@example.com");
//     });


//     test("Signup should fail if email already exists", async () => {
//         (User.query as any).mockReturnValue({
//             findOne: jest.fn().mockResolvedValue({ email: "exists@example.com" }),
//         });

//         const res = await request(app)
//             .post("/api/auth/signup")
//             .send({ email: "exists@example.com", password: "123456" });

//         expect(res.status).toBe(400);
//         expect(res.body.message).toBe("Email already exists");
//     });


//     test("Login should return JWT tokens when credentials valid", async () => {
//         const hashedPassword = await bcrypt.hash("123456", 10);

//         (User.query as any).mockReturnValue({
//             findOne: jest.fn().mockResolvedValue({
//                 id: 1,
//                 email: "test@example.com",
//                 password: hashedPassword,
//                 role: "user",
//             }),
//         });

//         const res = await request(app)
//             .post("/api/auth/login")
//             .send({ email: "test@example.com", password: "123456" });

//         expect(res.status).toBe(200);
//         expect(res.body.message).toBe("Login successful");
//         expect(res.body.accessToken).toBeDefined();
//         expect(res.body.refreshToken).toBeDefined();
//     });

//     test(" Login should fail for invalid credentials", async () => {
//         (User.query as any).mockReturnValue({
//             findOne: jest.fn().mockResolvedValue(null),
//         });

//         const res = await request(app)
//             .post("/api/auth/login")
//             .send({ email: "wrong@example.com", password: "wrongpass" });

//         expect(res.status).toBe(400);
//         expect(res.body.message).toBe("Invalid credentials");
//     });
// });












// import { signup, verifyEmail, login } from "../controllers/auth";
// import { User } from "../models/User";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";

// jest.mock("../models/User");
// jest.mock("bcrypt");
// jest.mock("jsonwebtoken");
// jest.mock("crypto");

// const mockReq = () => ({ body: {}, query: {}, params: {} }) as any;

// const mockRes = () => {
//     const res: any = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);
//     return res;
// };

// beforeEach(() => {
//     jest.clearAllMocks();
// });

// //
// // -------------------------------------------------------------------
// // SIGNUP TESTS
// // -------------------------------------------------------------------
// //

// describe("Auth Controller - Signup", () => {
//     test("Signup → success", async () => {
//         const req = mockReq();
//         const res = mockRes();

//         req.body = { email: "a@test.com", password: "123456", role: "user" };

//         // MOCKS FIXED
//         (User.query as any).mockReturnValue({
//             findOne: jest.fn().mockResolvedValue(null), // No existing user
//             insert: jest.fn().mockResolvedValue({
//                 id: 1,
//                 email: "a@test.com",
//                 role: "user",
//                 verification_token: "fake_token_123",
//             })
//         });

//         (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_pwd");
//         (crypto.randomBytes as jest.Mock).mockReturnValue({
//             toString: () => "fake_token_123",
//         });

//         await signup(req, res);

//         expect(res.status).toHaveBeenCalledWith(201);

//         expect(res.json).toHaveBeenCalledWith(
//             expect.objectContaining({
//                 message: "Signup successful!",
//                 verificationLink:
//                     "http://localhost:5173/verify-email?token=fake_token_123",
//             })
//         );
//     });

//     test("Signup → email exists", async () => {
//         const req = mockReq();
//         const res = mockRes();

//         req.body = { email: "a@test.com", password: "123456" };

//         (User.query as any).mockReturnValue({
//             findOne: jest.fn().mockResolvedValue({ id: 999 }), // Existing user
//         });

//         await signup(req, res);

//         expect(res.status).toHaveBeenCalledWith(400);
//         expect(res.json).toHaveBeenCalledWith({
//             message: "Email already exists",
//         });
//     });

//     test("Signup → DB error", async () => {
//         const req = mockReq();
//         const res = mockRes();

//         req.body = { email: "a@test.com", password: "123456" };

//         (User.query as any).mockReturnValue({
//             findOne: jest.fn().mockRejectedValue(new Error("DB broke")),
//         });

//         await signup(req, res);

//         expect(res.status).toHaveBeenCalledWith(500);
//         expect(res.json).toHaveBeenCalledWith({
//             message: "Server error",
//         });
//     });
// });


// //
// // -------------------------------------------------------------------
// // VERIFY EMAIL TESTS
// // -------------------------------------------------------------------
// //

// describe("Auth Controller - Verify Email", () => {
//     test("Verify Email → success", async () => {
//         const req = mockReq();
//         const res = mockRes();

//         req.query = { token: "abc123" };

//         (User.query as any).mockReturnValue({
//             findOne: jest.fn().mockResolvedValue({ id: 1 }),
//             findById: jest.fn().mockReturnValue({
//                 patch: jest.fn().mockResolvedValue(true),
//             }),
//         });

//         await verifyEmail(req, res);

//         expect(res.json).toHaveBeenCalledWith({
//             message: "Email verified successfully! You can now login.",
//         });
//     });

//     test("Verify Email → invalid token", async () => {
//         const req = mockReq();
//         const res = mockRes();

//         req.query = { token: "abc123" };

//         (User.query as any).mockReturnValue({
//             findOne: jest.fn().mockResolvedValue(undefined),
//         });

//         await verifyEmail(req, res);

//         expect(res.status).toHaveBeenCalledWith(400);
//         expect(res.json).toHaveBeenCalledWith({
//             message: "Invalid token",
//         });
//     });

//     test("Verify Email → DB error", async () => {
//         const req = mockReq();
//         const res = mockRes();

//         req.query = { token: "abc123" };

//         (User.query as any).mockReturnValue({
//             findOne: jest.fn().mockRejectedValue(new Error("DB Error")),
//         });

//         await verifyEmail(req, res);

//         expect(res.status).toHaveBeenCalledWith(500);
//     });
// });


// //
// // -------------------------------------------------------------------
// // LOGIN TESTS
// // -------------------------------------------------------------------
// //

// describe("Auth Controller - Login", () => {
//     test("Login → success", async () => {
//         const req = mockReq();
//         const res = mockRes();

//         req.body = { email: "a@test.com", password: "123456" };

//         (User.query as any).mockReturnValue({
//             findOne: jest.fn().mockResolvedValue({
//                 id: 1,
//                 email: "a@test.com",
//                 role: "user",
//                 password: "hashedpwd"
//             })
//         });

//         (bcrypt.compare as jest.Mock).mockResolvedValue(true);

//         (jwt.sign as jest.Mock)
//             .mockReturnValueOnce("access_token")
//             .mockReturnValueOnce("refresh_token");

//         await login(req, res);

//         expect(res.json).toHaveBeenCalledWith(
//             expect.objectContaining({
//                 message: "Login successful",
//                 accessToken: "access_token",
//                 refreshToken: "refresh_token",
//             })
//         );
//     });

//     test("Login → invalid credentials (no user)", async () => {
//         const req = mockReq();
//         const res = mockRes();

//         req.body = { email: "a@test.com", password: "123456" };

//         (User.query as any).mockReturnValue({
//             findOne: jest.fn().mockResolvedValue(undefined),
//         });

//         await login(req, res);

//         expect(res.status).toHaveBeenCalledWith(400);
//     });

//     test("Login → DB error", async () => {
//         const req = mockReq();
//         const res = mockRes();

//         req.body = { email: "a@test.com", password: "123456" };

//         (User.query as any).mockReturnValue({
//             findOne: jest.fn().mockRejectedValue(new Error("DB Error")),
//         });

//         await login(req, res);

//         expect(res.status).toHaveBeenCalledWith(500);
//     });
// });














import { signup, verifyEmail, login } from "../controllers/auth";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

jest.mock("../models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("crypto");



const mockReq = (data: any = {}) =>
({
    body: data.body || {},
    query: data.query || {},
    params: data.params || {},
} as any);

const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockUserQuery = (methods: any) => {
    (User.query as any).mockReturnValue(methods);
};

beforeEach(() => jest.clearAllMocks());


describe("Auth Controller - Signup", () => {
    const fakeUser = {
        id: 1,
        email: "a@test.com",
        role: "user",
        verification_token: "fake_token_123",
    };

    test("Signup → success", async () => {
        const req = mockReq({
            body: { email: "a@test.com", password: "123456", role: "user" },
        });
        const res = mockRes();

        mockUserQuery({
            findOne: jest.fn().mockResolvedValue(null),
            insert: jest.fn().mockResolvedValue(fakeUser),
        });

        (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_pwd");
        (crypto.randomBytes as jest.Mock).mockReturnValue({
            toString: () => "fake_token_123",
        });

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Signup successful!",
                verificationLink:
                    "http://localhost:5173/verify-email?token=fake_token_123",
            })
        );
    });

    test("Signup → email exists", async () => {
        const req = mockReq({
            body: { email: "a@test.com", password: "123456" },
        });
        const res = mockRes();

        mockUserQuery({
            findOne: jest.fn().mockResolvedValue({ id: 999 }),
        });

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Email already exists",
        });
    });

    test("Signup → DB error", async () => {
        const req = mockReq({
            body: { email: "a@test.com", password: "123456" },
        });
        const res = mockRes();

        mockUserQuery({
            findOne: jest.fn().mockRejectedValue(new Error("DB broke")),
        });

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});



describe("Auth Controller - Verify Email", () => {
    test("Verify Email → success", async () => {
        const req = mockReq({ query: { token: "abc123" } });
        const res = mockRes();

        mockUserQuery({
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
            findById: jest.fn().mockReturnValue({
                patch: jest.fn().mockResolvedValue(true),
            }),
        });

        await verifyEmail(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: "Email verified successfully! You can now login.",
        });
    });

    test("Verify Email → invalid token", async () => {
        const req = mockReq({ query: { token: "abc123" } });
        const res = mockRes();

        mockUserQuery({
            findOne: jest.fn().mockResolvedValue(undefined),
        });

        await verifyEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid token",
        });
    });

    test("Verify Email → DB error", async () => {
        const req = mockReq({ query: { token: "abc123" } });
        const res = mockRes();

        mockUserQuery({
            findOne: jest.fn().mockRejectedValue(new Error("DB Error")),
        });

        await verifyEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});



describe("Auth Controller - Login", () => {
    const credentials = { email: "a@test.com", password: "123456" };

    test("Login → success", async () => {
        const req = mockReq({ body: credentials });
        const res = mockRes();

        mockUserQuery({
            findOne: jest.fn().mockResolvedValue({
                id: 1,
                email: credentials.email,
                role: "user",
                password: "hashedpwd",
            }),
        });

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock)
            .mockReturnValueOnce("access_token")
            .mockReturnValueOnce("refresh_token");

        await login(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Login successful",
                accessToken: "access_token",
                refreshToken: "refresh_token",
            })
        );
    });

    test("Login → invalid credentials (no user)", async () => {
        const req = mockReq({ body: credentials });
        const res = mockRes();

        mockUserQuery({
            findOne: jest.fn().mockResolvedValue(undefined),
        });

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test("Login → DB error", async () => {
        const req = mockReq({ body: credentials });
        const res = mockRes();

        mockUserQuery({
            findOne: jest.fn().mockRejectedValue(new Error("DB Error")),
        });

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});
