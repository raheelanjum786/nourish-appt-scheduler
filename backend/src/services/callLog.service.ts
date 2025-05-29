import CallLog from '../models/callLog.model';
import { CallStatus } from '../enums/callStatus.enum';

export const logCallEvent = async (
  appointmentId: string,
  userId: string,
  eventType: string,
  details: Record<string, any>
) => {
  try {
    await CallLog.create({
      appointment: appointmentId,
      user: userId,
      eventType,
      details,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Failed to log call event:', error);
  }
};

export const getCallHistory = async (appointmentId: string) => {
  return CallLog.find({ appointment: appointmentId })
    .sort({ timestamp: -1 })
    .populate('user', 'name email');
};