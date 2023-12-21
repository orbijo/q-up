import express from "express";
import { loginUser, loginBusiness } from "../controllers/auth.js";

const router = express.Router();

router.post("/login/user", loginUser);
router.post("/login/business", loginBusiness);

export default router;
