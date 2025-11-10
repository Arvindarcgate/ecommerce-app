
import express from "express";
import { createOrder, getAllOrders } from "../controllers/ordercontroller";

const router = express.Router();

router.post("/create", createOrder);
router.get("/all", getAllOrders);

export default router;
