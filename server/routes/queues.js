import express from "express";
import { createQueue, getBusinessQueue, getUserQueue,  } from "../controllers/queues.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* CREATE */
router.post("/:businessId/:userId", createQueue)

/* READ */
router.get("/:businessId", getBusinessQueue);
router.get("/:userId", getUserQueue);

/* UPDATE */

/* DELETE */

export default router;
