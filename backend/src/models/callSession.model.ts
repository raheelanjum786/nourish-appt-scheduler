import mongoose, { Document, Schema } from 'mongoose';

export interface ICallSession extends Document {
  appointment: mongoose.Schema.Types.ObjectId;
  initiator: mongoose.Schema.Types.ObjectId;
  callType: 'video' | 'voice';
  status: 'initiating' | 'active' | 'ended';
  offer: any;
  answer?: any;
  iceCandidates: any[];
  startedAt: Date;
  endedAt?: Date;
}

const CallSessionSchema = new Schema<ICallSession>({
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
  initiator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  callType: { type: String, enum: ['video', 'voice'], required: true },
  status: { type: String, enum: ['initiating', 'active', 'ended'], default: 'initiating' },
  offer: { type: Object, required: true },
  answer: { type: Object },
  iceCandidates: { type: [Object], default: [] },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
});

export const CallSession = mongoose.model<ICallSession>('CallSession', CallSessionSchema);