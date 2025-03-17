// controllers/adminController.js
import Coupon from "../models/Coupon.js";
import Admin from "../models/Admin.js";

// Get all coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add multiple coupons
export const addCoupons = async (req, res) => {
  try {
    const { codes } = req.body;

    if (!Array.isArray(codes)) {
      return res.status(400).json({ message: "Invalid coupon codes format" });
    }

    const coupons = codes.map((code) => ({ code }));
    await Coupon.insertMany(coupons);

    res.json({ message: `${codes.length} coupons added successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error adding coupons" });
  }
};

// Toggle coupon status
export const toggleCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    coupon.claimed = !coupon.claimed;
    await coupon.save();

    res.json({
      message: `Coupon ${coupon.code} status updated`,
      newStatus: coupon.claimed ? "Claimed" : "Available",
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating coupon" });
  }
};

// Get claim history
export const getClaimHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const claims = await Coupon.find({ claimed: true })
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("code claimedBy ip updatedAt");

    const count = await Coupon.countDocuments({ claimed: true });

    res.json({
      claims,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
};
