import mongoose, { Document, Schema } from 'mongoose';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface IAppointment extends Document {
  user: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  consultationType: string; 
}

const appointmentSchema = new Schema<IAppointment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service is required'],
    },
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
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.PENDING,
    },
    notes: {
      type: String,
    },
    consultationType: { 
      type: String,
      required: [true, 'Consultation type is required'],
      enum: ['video', 'voice', 'in-person'], 
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);