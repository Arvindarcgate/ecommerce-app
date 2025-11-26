import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

/* ============================================================
   ✔ SIGNUP - Returns { success, token } exactly as frontend needs
=============================================================== */

// export const signup = async (req: Request, res: Response) => {
//     const { email, password, role } = req.body;

//     try {
//         const existingUser = await User.query().findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Email already exists",
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user: IUser = await User.query().insert({
//             email,
//             password: hashedPassword,
//             role: role || "user",
//         });

//         return res.status(201).json({
//             success: true,
//             message: "User registered successfully",
//             user: {
//                 id: user.id,
//                 email: user.email,
//                 role: user.role,
//             },
//         });
//     } catch (err) {
//         console.error("Signup Error:", err);
//         return res.status(500).json({
//             success: false,
//             message: "Server error",
//         });
//     }
// };



export const signup = async (req: Request, res: Response) => {
    console.log("📥 Incoming signup request:", req.body);

    const { email, password } = req.body;

    try {
        // Email check
        const existingUser = await User.query().findOne({ email });
        if (existingUser) {
            console.log("❌ Email already exists");
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const user = await User.query().insert({
            email,
            password: hashedPassword,
            role: "user",
        });

        console.log("✅ User created:", user);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
        });

    } catch (err: any) {
        console.error("🔥 Signup Error:", err);

        return res.status(500).json({
            success: false,
            message: err.message || "Server error",
        });
    }
};


/* ============================================================
   ✔ VERIFY EMAIL
=============================================================== */

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
        return res.status(400).json({ message: "Invalid token" });
    }

    try {
        const user = await User.query().findOne({ verification_token: token });

        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        }

        await User.query()
            .findById(user.id)
            .patch({
                is_verified: true,

            });

        return res.json({
            message: "Email verified successfully! You can now login."
        });

    } catch (err) {
        console.error("Verification Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user: IUser | undefined = await User.query().findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        return res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            accessToken,
        });

    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

