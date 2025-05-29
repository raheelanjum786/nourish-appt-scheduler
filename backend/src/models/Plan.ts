import mongoose, { Document, Schema } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  description: string;
  durationDays: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    durationDays: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Plan = mongoose.model<IPlan>('Plan', PlanSchema);

export default Plan;