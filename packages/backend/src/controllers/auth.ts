import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// ✅ Signup Controller
// export const signup = async (req: Request, res: Response) => {
//     const { email, password, role } = req.body;

//     try {
//         const existingUser = await User.query().findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already exists" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user: IUser = await User.query().insert({
//             email,
//             password: hashedPassword,
//             role: role || "user",
//         });

//         res.status(201).json({
//             message: "User created",
//             user: {
//                 id: user.id,
//                 email: user.email,
//                 role: user.role,
//             },
//         });
//     } catch (err) {
//         console.error("Signup Error:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };




export const signup = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    try {
        const existingUser = await User.query().findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user: IUser = await User.query().insert({
            email,
            password: hashedPassword,
            role: role || "user",
            is_verified: false,
            verification_token: verificationToken,
        });

        // Generate a verification link (frontend route)
        const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;

        res.status(201).json({
            message: "Signup successful!",
            verificationLink, // return the clickable link
            user: { id: user.id, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};



export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
        return res.status(400).json({ message: "Invalid token" });
    }

    try {
        const user = await User.query().findOne({ verification_token: token });
        if (!user) return res.status(400).json({ message: "Invalid token" });

        await User.query()
            .findById(user.id)
            .patch({ is_verified: true, verification_token: undefined });

        res.json({ message: "Email verified successfully! You can now login." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
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

        const refreshToken = jwt.sign(
            { id: user.id, role: user.role },
            REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
        );

        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
