// src/server.ts
import express, { Request, Response } from "express";
import newsletterRoute from "./routes/newsletter.route";
import cors from "cors";
import authRoute from "./routes/auth";
import { db } from "./db/db"; // ✅ Import Knex instance
import productRoutes from './routes/productroutes';
import path from "path";
import adminEditRoutes from "./routes/admineditroutes"
import orderRoutes from "./routes/orderroutes";

const app = express();
const PORT: number = 8000;

app.use(
    cors({
        credentials: true,
    })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", newsletterRoute);
app.use("/api/auth", authRoute);
app.use('/api/products', productRoutes);
app.get("/", (_req: Request, res: Response): void => {
    res.send("Server is running");
});
app.use("/api/products", adminEditRoutes);



app.use("/api/orders", orderRoutes);

// ✅ Start DB connection check
(async () => {
    try {
        await db.raw("SELECT 1");
        console.log("✅ MySQL Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
})();

// ✅ Only listen when not running tests
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, (): void => {
        console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
}

// ✅ Export for Supertest
export default app;
