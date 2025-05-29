import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPlanOrder extends Document {
  user: Types.ObjectId;
  plan: Types.ObjectId;
  orderDate: Date;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const PlanOrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
    orderDate: { type: Date, default: Date.now },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  },
  { timestamps: true }
);

const PlanOrder = mongoose.model<IPlanOrder>('PlanOrder', PlanOrderSchema);

export default PlanOrder;