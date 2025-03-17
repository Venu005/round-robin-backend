import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    claimed: {
      type: Boolean,
      default: false,
    },
    claimedBy: {
      ip: String,
      userAgent: String,
      claimedAt: Date,
    },
    assignmentOrder: {
      type: Number,
      default: Date.now(),
      index: true,
    },

    cooldownExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
