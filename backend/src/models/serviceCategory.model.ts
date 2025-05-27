import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceCategory extends Document {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceCategorySchema = new Schema<IServiceCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Category description is required'],
    },
    image: {
      type: String,
      required: [true, 'Category image is required'],
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

export default mongoose.model<IServiceCategory>('ServiceCategory', serviceCategorySchema);