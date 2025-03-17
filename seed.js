import mongoose from "mongoose";
import Coupon from "./models/Coupon.js";
import Admin from "./models/Admin.js";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  // Clear existing data
  await Coupon.deleteMany();
  await Admin.deleteMany();

  // Create admin
  await Admin.create({
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  });

  // Add sample coupons
  const coupons = ["WELCOME10", "SUMMER25", "NEWUSER15", "FREESHIP", "SAVE20"];

  await Coupon.insertMany(coupons.map((code) => ({ code })));

  console.log("Database seeded successfully");
  process.exit();
};

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
