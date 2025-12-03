import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/adminauthcontroller";

const router = express.Router();

router.post("/signup", registerAdmin);
router.post("/login", loginAdmin);





export default router;
