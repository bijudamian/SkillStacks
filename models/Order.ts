import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrder extends Document {
  stripeSessionId: string;
  customerEmail: string;
  productSlug: string;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    stripeSessionId: { type: String, required: true, unique: true },
    customerEmail: { type: String, required: true },
    productSlug: { type: String, required: true },
    amountTotal: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentStatus: { type: String, required: true },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
