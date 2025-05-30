import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Payment document
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

// Define the Mongoose schema for Payment
const PaymentSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment', // Assuming you have an Appointment model
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true, // Payment Intent IDs should be unique
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'usd', // Default currency based on your Stripe integration
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refund_requested', 'refunded'],
      default: 'pending',
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create and export the Payment model
const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;