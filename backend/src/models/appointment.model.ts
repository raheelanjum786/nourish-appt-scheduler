import mongoose, { Document } from 'mongoose';

// You'll need to update your appointment model to include PENDING status
// This is a partial update assuming the model already exists

export enum AppointmentStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export enum ConsultationType {
  IN_PERSON = 'in-person',
  VIDEO = 'video',
  PHONE = 'phone',
}

export interface IAppointment extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  consultationType: ConsultationType;
  paymentId?: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
}

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Appointment must belong to a user'],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Appointment must be for a service'],
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
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
      enum: Object.values(ConsultationType),
      required: [true, 'Consultation type is required'],
    },
    paymentId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;