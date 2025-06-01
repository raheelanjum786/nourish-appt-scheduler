import mongoose, { Document, Schema } from 'mongoose';

export enum TimeSlotStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
}

export interface ITimeSlot extends Document {
  date: Date;
  startTime: string;
  endTime: string;
  status: TimeSlotStatus;
  service?: mongoose.Types.ObjectId; 
  appointment?: mongoose.Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const timeSlotSchema = new Schema<ITimeSlot>(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    status: {
      type: String,
      enum: Object.values(TimeSlotStatus),
      default: TimeSlotStatus.AVAILABLE,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: false,
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITimeSlot>('TimeSlot', timeSlotSchema);