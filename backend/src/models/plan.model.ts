import mongoose, { Document } from 'mongoose';

export enum PlanDuration {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export interface IPlan extends Document {
  name: string;
  description: string;
  duration: PlanDuration;
  price: number;
  features: string[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Plan description is required'],
    },
    duration: {
      type: String,
      enum: Object.values(PlanDuration),
      required: [true, 'Plan duration is required'],
    },
    price: {
      type: Number,
      required: [true, 'Plan price is required'],
    },
    features: [{
      type: String,
      required: [true, 'Plan features are required'],
    }],
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Plan = mongoose.model<IPlan>('Plan', planSchema);

export default Plan;