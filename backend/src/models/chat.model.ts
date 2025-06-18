import mongoose, { Schema, Document } from 'mongoose';

export enum MessageType {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
  VIDEO_CALL_REQUEST = 'VIDEO_CALL_REQUEST',
  VOICE_CALL_REQUEST = 'VOICE_CALL_REQUEST',
}

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  content: string;
  type: MessageType;
  timestamp: Date;
  read: boolean;
  mediaUrl?: string;
}

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
  relatedTo: {
    type: string; // 'appointment' or 'plan'
    id: mongoose.Types.ObjectId;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(MessageType),
    default: MessageType.TEXT,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
  mediaUrl: {
    type: String,
  },
});

const ChatSchema = new Schema<IChat>(
  {
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    messages: [MessageSchema],
    relatedTo: {
      type: {
        type: String,
        enum: ['appointment', 'plan'],
        required: true,
      },
      id: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'relatedTo.type',
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IChat>('Chat', ChatSchema);