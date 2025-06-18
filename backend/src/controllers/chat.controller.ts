import { Request, Response } from 'express';
import ChatMessage from '../models/chat.model';
import Appointment, { AppointmentStatus } from '../models/appointment.model';
import PlanSubscription, { SubscriptionStatus } from '../models/planSubscription.model';
import { broadcastToAppointment } from '../utils/websocket';
import { logCallEvent } from '../services/callLog.service';

// Send a message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { appointmentId, message, type = 'text' } = req.body;
    const senderId = req.user?.id;

    if (!senderId) {
      return res.status(401).json({
        status: 'fail',
        message: 'User not authenticated',
      });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Appointment not found',
      });
    }

    // Check if user is authorized to send messages for this appointment
    const isAdmin = req.user?.role === 'ADMIN';
    const isAppointmentUser = appointment.user.toString() === senderId.toString();

    if (!isAdmin && !isAppointmentUser) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to send messages for this appointment',
      });
    }

    // Check if appointment is confirmed
    if (appointment.status !== AppointmentStatus.CONFIRMED) {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot send messages for appointments that are not confirmed',
      });
    }

    // Determine receiver (if sender is user, receiver is admin and vice versa)
    let receiverId;
    if (isAppointmentUser) {
      const populatedAppointment = await Appointment.findById(appointmentId).populate('user');
      // Added check for populatedAppointment and populatedAppointment.user
      if (populatedAppointment && populatedAppointment.user) {
        receiverId = (populatedAppointment.user as any)._id; // Use as any to access _id on populated user
      } else {
        // Handle the case where population failed or user is missing
        return res.status(400).json({
          status: 'fail',
          message: 'Could not determine message receiver: User not found on appointment',
        });
      }
    } else {
      receiverId = appointment.user;
    }

    if (!receiverId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Could not determine message receiver',
      });
    }

    // Create chat message
    const chatMessage = await ChatMessage.create({
      sender: senderId,
      receiver: receiverId,
      message,
      appointment: appointmentId,
      isRead: false,
      type,
    });

    // Populate sender info for response
    const populatedMessage = await ChatMessage.findById(chatMessage._id)
      .populate('sender', 'name role');

    // Broadcast message to appointment participants
    broadcastToAppointment(appointmentId, {
      type: 'new_message',
      message: populatedMessage,
    });

    res.status(201).json({
      status: 'success',
      data: {
        message: populatedMessage,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to send message',
    });
  }
};

// Get messages for an appointment
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'User not authenticated',
      });
    }

    // Check if appointment exists
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Appointment not found',
      });
    }

    // Check if user is authorized to view messages for this appointment
    const isAdmin = req.user?.role === 'ADMIN';
    const isAppointmentUser = appointment.user.toString() === userId.toString();

    if (!isAdmin && !isAppointmentUser) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to view messages for this appointment',
      });
    }

    // Get messages
    const messages = await ChatMessage.find({ appointment: appointmentId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name role');

    // Mark messages as read if user is the receiver
    if (messages.length > 0) {
      await ChatMessage.updateMany(
        {
          appointment: appointmentId,
          receiver: userId,
          isRead: false
        },
        { isRead: true }
      );
    }

    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: {
        messages,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch messages',
    });
  }
};

export const initiateCall = async (req: Request, res: Response) => {
  try {
    const { appointmentId, callType } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'User not authenticated',
      });
    }

    // Check if appointment exists and is confirmed
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Appointment not found',
      });
    }

    // Check if user is authorized for this appointment
    const isAdmin = req.user?.role === 'ADMIN';
    const isAppointmentUser = appointment.user.toString() === userId.toString();

    if (!isAdmin && !isAppointmentUser) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized for this appointment',
      });
    }

    // Check if appointment is confirmed
    if (appointment.status !== AppointmentStatus.CONFIRMED) {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot initiate call for appointments that are not confirmed',
      });
    }

    // Determine receiver
    let receiverId;
    if (isAppointmentUser) {
      const populatedAppointment = await Appointment.findById(appointmentId).populate('user');
       // Added check for populatedAppointment and populatedAppointment.user
      if (populatedAppointment && populatedAppointment.user) {
        receiverId = (populatedAppointment.user as any)._id; // Use as any to access _id on populated user
      } else {
         // Handle the case where population failed or user is missing
         return res.status(400).json({
           status: 'fail',
           message: 'Could not determine message receiver: User not found on appointment',
         });
      }
    } else {
      receiverId = appointment.user;
    }

    if (!receiverId) {
       return res.status(400).json({
         status: 'fail',
         message: 'Could not determine message receiver',
       });
     }

    // Create call message
    const callMessage = await ChatMessage.create({
      sender: userId,
      receiver: receiverId,
      message: `${callType} call initiated`,
      appointment: appointmentId,
      isRead: false,
      type: `${callType}-call`,
      callStatus: 'initiated',
    });

    // Log call event
    await logCallEvent(
      appointmentId,
      userId.toString(),
      'call_initiated',
      { callType, timestamp: new Date() }
    );

    // Broadcast call initiation to appointment participants
    broadcastToAppointment(appointmentId, {
      type: 'call_initiated',
      callType,
      initiator: userId,
      callMessage,
    });

    res.status(200).json({
      status: 'success',
      data: {
        callMessage,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to initiate call',
    });
  }
};

export const updateCallStatus = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'User not authenticated',
      });
    }

    // Find call message
    const callMessage = await ChatMessage.findById(messageId);

    if (!callMessage) {
      return res.status(404).json({
        status: 'fail',
        message: 'Call message not found',
      });
    }

    // Check if user is authorized
    // Use as any to access appointment property
    const appointment = await Appointment.findById((callMessage as any).appointment as string);

    if (!appointment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Associated appointment not found',
      });
    }

    const isAdmin = req.user?.role === 'ADMIN';
    const isAppointmentUser = appointment.user.toString() === userId.toString();

    if (!isAdmin && !isAppointmentUser) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not authorized to update this call',
      });
    }

    // Update call status
    // Use as any to access callStatus property
    (callMessage as any).callStatus = status;
    await callMessage.save();

    // Log call event
    await logCallEvent(
      appointment._id.toString(),
      userId.toString(),
      `call_${status}`,
      // Use as any to access message property
      { callType: ((callMessage as any).message as string).split('-')[0], timestamp: new Date() }
    );

    // Broadcast call status update
    broadcastToAppointment(appointment._id.toString(), {
      type: 'call_status_updated',
      callId: callMessage._id,
      status,
    });

    res.status(200).json({
      status: 'success',
      data: {
        callMessage,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update call status',
    });
  }
};

// Get unread message count
export const getUnreadMessageCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const unreadCount = await ChatMessage.countDocuments({
      receiver: userId,
      isRead: false,
    });

    res.status(200).json({
      status: 'success',
      data: {
        unreadCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch unread message count',
    });
  }
};