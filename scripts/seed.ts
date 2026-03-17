import mongoose from "mongoose";
import Product from "../models/Product";
import { products } from "../data/products";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}
async function seed(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.error("[seed] Connected to MongoDB");

    await Product.deleteMany({});
    console.error("[seed] Cleared existing products");

    const inserted = await Product.insertMany(products);
    console.error(`[seed] Successfully inserted ${inserted.length} products`);

    await mongoose.disconnect();
    console.error("[seed] Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("[seed] Error:", error);
    process.exit(1);
  }
}

seed();
