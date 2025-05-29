import mongoose from 'mongoose';

export interface IChatMessage extends mongoose.Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  message: string;
  appointment: mongoose.Types.ObjectId;
  isRead: boolean;
  type: 'text' | 'video-call' | 'voice-call';
  callStatus?: 'initiated' | 'ongoing' | 'completed' | 'missed';
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new mongoose.Schema<IChatMessage>(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: ['text', 'video-call', 'voice-call'], required: true },
    callStatus: { type: String, enum: ['initiated', 'ongoing', 'completed', 'missed'] }
  },
  { timestamps: true }
);

export default mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);