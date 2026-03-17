import mongoose, { Schema, Document } from "mongoose";
import type { IProduct } from "@/types";

export interface IProductDocument extends Omit<IProduct, "_id">, Document {}

const ProductSchema = new Schema<IProductDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    whatYouLearn: { type: [String], required: true },
    tools: { type: [String], required: true },
    mistakesToAvoid: { type: [String], required: true },
    price: { type: Number, required: true },
    currency: { type: String, enum: ["usd", "inr"], required: true },
    pdfUrl: { type: String, required: true },
    coverImage: { type: String, required: true },
    category: {
      type: String,
      enum: ["investing", "fitness", "productivity", "youtube"],
      required: true,
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);


const Product =
  mongoose.models.Product ||
  mongoose.model<IProductDocument>("Product", ProductSchema);

export default Product;
