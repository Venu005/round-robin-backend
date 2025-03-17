import Coupon from "../models/Coupon.js";

export const checkAbuse = async (req, res, next) => {
  try {
    const ip = req.ip;
    const userAgent = req.get("User-Agent");
    const cookie = req.cookies.couponClaimed;

    // IP-based check
    const recentClaim = await Coupon.findOne({
      "claimedBy.ip": ip,
      cooldownExpires: { $gt: Date.now() },
    });

    if (recentClaim) {
      return res.status(429).json({
        message: `Cooldown active. Try again after ${recentClaim.cooldownExpires}`,
      });
    }

    // Cookie-based check
    if (cookie) {
      return res.status(429).json({
        message: "You have already claimed a coupon from this browser",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
