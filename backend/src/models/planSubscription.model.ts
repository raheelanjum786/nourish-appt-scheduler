import mongoose, { Document } from 'mongoose';

export enum SubscriptionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export interface IPlanSubscription extends Document {
  user: mongoose.Types.ObjectId;
  plan: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatus;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const planSubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: [true, 'Plan is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.PENDING,
    },
    paymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PlanSubscription = mongoose.model<IPlanSubscription>('PlanSubscription', planSubscriptionSchema);

export default PlanSubscription;