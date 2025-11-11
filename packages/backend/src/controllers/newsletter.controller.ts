import { Request, Response } from "express";
import db from "../db/Knex";

export const subscribe = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const userId = (req as any).user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        await db("subscribers").insert({ email, user_id: userId });
        return res.status(201).json({ message: "Subscribed successfully" });
    } catch (error) {
        console.error("❌ Error inserting email:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};
