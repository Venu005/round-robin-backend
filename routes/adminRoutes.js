import express from "express";
import {
  getCoupons,
  addCoupons,
  toggleCoupon,
  getClaimHistory,
} from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Protect all admin routes
router.use(verifyAdmin);

// Coupon management
router.get("/coupons", getCoupons);
router.post("/coupons", addCoupons);
router.patch("/coupons/:id", toggleCoupon);

// Claim history
router.get("/history", getClaimHistory);

export default router;
