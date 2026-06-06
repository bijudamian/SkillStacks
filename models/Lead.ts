import mongoose, { Document, Model, Schema } from "mongoose";

export interface ILead extends Document {
  email: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    email: { type: String, required: true, unique: true },
    source: { type: String, default: "homepage" },
  },
  { timestamps: true }
);

const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

export default Lead;
