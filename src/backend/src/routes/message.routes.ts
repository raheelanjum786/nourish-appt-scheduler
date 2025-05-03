
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authorize } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Input validation schema
const messageSchema = z.object({
  content: z.string().min(1),
  recipientId: z.string().uuid(),
  appointmentId: z.string().uuid().optional(),
});

// Get messages for a user
router.get('/', authorize(), async (req, res) => {
  try {
    const userId = req.user!.userId;
    
    // Get conversations (latest message from each unique conversation partner)
    const conversations = await prisma.$queryRaw`
      SELECT 
        m.*,
        u.name as senderName,
        u.email as senderEmail
      FROM Message m
      JOIN User u ON m.senderId = u.id
      WHERE m.id IN (
        SELECT MAX(id) FROM Message
        WHERE recipientId = ${userId} OR senderId = ${userId}
        GROUP BY 
          CASE 
            WHEN senderId = ${userId} THEN recipientId
            ELSE senderId
          END
      )
      ORDER BY m.createdAt DESC
    `;
    
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
});

// Get conversation with specific user
router.get('/conversation/:userId', authorize(), async (req, res) => {
  try {
    const currentUserId = req.user!.userId;
    const otherUserId = req.params.userId;
    
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: currentUserId }
        ]
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        recipientId: currentUserId,
        read: false
      },
      data: { read: true }
    });
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Server error while fetching conversation' });
  }
});

// Send a message
router.post('/', authorize(), async (req, res) => {
  try {
    const validatedData = messageSchema.parse(req.body);
    const senderId = req.user!.userId;
    
    // Create the message
    const message = await prisma.message.create({
      data: {
        content: validatedData.content,
        senderId,
        recipientId: validatedData.recipientId,
        appointmentId: validatedData.appointmentId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    res.status(201).json(message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
});

export default router;
