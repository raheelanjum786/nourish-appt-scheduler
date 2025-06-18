import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  duration: number; 
  price: number;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  consultationType: string;
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
    consultationType: {
      type: String,
      enum: ['video', 'voice', 'in person'],
      required: [true, 'Consultation type is required'],
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