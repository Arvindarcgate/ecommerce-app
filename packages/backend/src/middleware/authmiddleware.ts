
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Token missing" });

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as any;
        (req as any).user = { id: decoded.id, role: decoded.role };
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};
