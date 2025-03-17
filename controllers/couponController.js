import { COOLDOWN_MS } from "../constants.js";
import Coupon from "../models/Coupon.js";
export const claimCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndUpdate(
      {
        claimed: false,
        $or: [
          { cooldownExpires: { $exists: false } },
          { cooldownExpires: { $lt: new Date() } },
        ],
      },
      {
        $set: {
          claimed: true,
          claimedBy: {
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            claimedAt: new Date(),
          },
          cooldownExpires: new Date(Date.now() + COOLDOWN_MS),
        },
      },
      {
        sort: { createdAt: 1 }, // Proper round-robin order
        new: true,
      }
    );

    if (!coupon) {
      return res.status(404).json({ message: "No available coupons" });
    }

    // Set cooldown cookie
    res.cookie("couponClaimed", "true", {
      maxAge: COOLDOWN_MS,
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({ coupon: coupon.code });
  } catch (err) {
    console.error("Claim error:", err);
    res.status(500).json({
      message: "Claim failed",
      error: process.env.NODE_ENV === "development" ? err.message : null,
    });
  }
};
