import { Request, Response } from 'express';
import ChatMessage from '../models/chat.model';
import Appointment from '../models/appointment.model';
import { protect } from '../middleware/auth.middleware';
import { WebSocket, WebSocketServer } from 'ws';
import { logCallEvent } from '../services/callLog.service';
import { CallSession } from '../models/callSession.model';
import { connections } from '../websocket/signaling.server';

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const messages = await ChatMessage.find({ appointment: appointmentId })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const sendAnswer = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { answer } = req.body;

    await CallSession.findOneAndUpdate(
      { appointment: appointmentId },
      { answer, status: 'active' }
    );

    const wss = req.app.get('wss') as WebSocketServer;
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({
          type: 'answer',
          appointmentId,
          answer
        }));
      }
    });

    res.status(200).json({ message: 'Answer received' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const initiateCall = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { callType } = req.body;
    const userId = req.user?.id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || 
        (appointment.user.toString() !== userId && 
         appointment.provider.toString() !== userId)) {
      return res.status(403).json({ message: 'Not authorized for this call' });
    }

    const offer = {
      type: 'offer',
      sdp: '', 
      callType
    };

    const callSession = new CallSession({
      appointment: appointmentId,
      initiator: userId,
      callType,
      status: 'initiating',
      offer,
      iceCandidates: []
    });
    await callSession.save();

    activeCalls.set(appointmentId, {
      sessionId: callSession._id,
      participants: new Set([userId])
    });

    res.status(200).json({
      offer,
      iceCandidates: []
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const sendOffer = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { offer } = req.body;
    
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const connectionId = `${appointmentId}-${appointment.service.provider}`;
    if (connections.has(connectionId)) {
      connections.get(connectionId)?.send(JSON.stringify({
        type: 'offer',
        offer
      }));
    }

    res.status(200).json({ message: 'Offer received' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



export const sendIceCandidate = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { candidate } = req.body;

    // Store candidate in session
    await CallSession.findOneAndUpdate(
      { appointment: appointmentId },
      { $push: { iceCandidates: candidate } }
    );

    // Relay candidate to other participants
    const wss = req.app.get('wss') as WebSocketServer;
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({
          type: 'ice-candidate',
          appointmentId,
          candidate
        }));
      }
    });

    res.status(200).json({ message: 'ICE candidate received' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const endCall = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;

    // Update call session
    await CallSession.findOneAndUpdate(
      { appointment: appointmentId },
      { status: 'ended', endedAt: new Date() }
    );

    // Notify participants
    const wss = req.app.get('wss') as WebSocketServer;
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({
          type: 'end-call',
          appointmentId
        }));
      }
    });

    activeCalls.delete(appointmentId);
    res.status(200).json({ message: 'Call ended' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};