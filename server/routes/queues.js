import express from "express";
import { createQueue, getBusinessQueues, getUserQueue, removeQueue } from "../controllers/queues.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// FULL ROUTE queues/

/* CREATE */
router.post("/:businessId/:userId", createQueue)

/* READ */
router.get("/business/:businessId", getBusinessQueues);
router.get("/user/:userId", getUserQueue);

/* UPDATE */

/* DELETE */
router.delete("/:id", removeQueue);

export default router;
