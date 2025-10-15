// server.ts

import express, { Request, Response } from "express";
import newsletterRoute from "./routes/newsletter.route";
import cors from "cors";
import authRoute from "./routes/auth";
import { db } from "./db/db"; // ✅ Import your Knex instance

const app = express();
const PORT: number = 8000;

app.use(
    cors({
        credentials: true,
    })
);

app.use(express.json());

app.use("/api", newsletterRoute);
app.use("/api/auth", authRoute);

app.get("/", (_req: Request, res: Response): void => {
    res.send("Server is running");
});

// ✅ Test Database Connection on Startup
(async () => {
    try {
        await db.raw("SELECT 1"); // Simple query to test connection
        console.log("✅ MySQL Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
})();

app.listen(PORT, (): void => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
