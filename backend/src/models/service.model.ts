import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  image?: string;
  category: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Service duration is required'],
      min: 15,
    },
    price: {
      type: Number,
      required: [true, 'Service price is required'],
      min: 0,
    },
    image: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      required: [true, 'Service category is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IService>('Service', serviceSchema);