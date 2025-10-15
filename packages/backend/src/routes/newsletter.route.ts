import express from "express";
import { subscribe } from "../controllers/newsletter.controller";
import { authenticate } from "../middleware/authmiddleware";

const router = express.Router();

router.post("/subscribe", authenticate, subscribe);

export default router;
