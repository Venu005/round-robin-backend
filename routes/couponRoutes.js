import express from "express";
import { checkAbuse } from "../middleware/abusePrevention.js";
import { claimCoupon } from "../controllers/couponController.js";

const router = express.Router();

router.post("/claim", checkAbuse, claimCoupon);

export default router;
