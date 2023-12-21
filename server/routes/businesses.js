import express from "express";
import {
  getBusiness,
  getBusinesses
} from "../controllers/businesses.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getBusiness);
router.get("/", verifyToken, getBusinesses);


/* UPDATE */

/* DELETE */


export default router;
