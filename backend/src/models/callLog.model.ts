import mongoose from 'mongoose';
import { CallStatus } from '../enums/callStatus.enum';

export interface ICallLog extends mongoose.Document {
  appointment: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  eventType: string;
  details: Record<string, any>;
  status: CallStatus;
  timestamp: Date;
}

const callLogSchema = new mongoose.Schema<ICallLog>(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventType: { type: String, required: true },
    details: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, enum: Object.values(CallStatus), default: CallStatus.INITIATED },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model<ICallLog>('CallLog', callLogSchema);