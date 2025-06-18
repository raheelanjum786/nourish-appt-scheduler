import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  appointmentId: mongoose.Types.ObjectId;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refund_requested' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment', 
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true, 
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'usd', 
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refund_requested', 'refunded'],
      default: 'pending',
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;