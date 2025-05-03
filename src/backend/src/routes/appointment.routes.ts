
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authorize } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Input validation schema
const appointmentSchema = z.object({
  date: z.string().transform(str => new Date(str)),
  appointmentType: z.enum(['VIDEO_CALL', 'VOICE_CALL', 'IN_PERSON']),
  serviceId: z.string().uuid(),
  providerId: z.string().uuid(),
});

// Get all appointments (filtered by user role)
router.get('/', authorize(), async (req, res) => {
  try {
    const { role, userId } = req.user!;
    let appointments;
    
    if (role === 'ADMIN') {
      // Admins can see all appointments
      appointments = await prisma.appointment.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          service: true,
          provider: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                }
              }
            }
          }
        }
      });
    } else if (role === 'PROVIDER') {
      // Providers see appointments where they're the provider
      const provider = await prisma.serviceProvider.findFirst({
        where: { userId }
      });
      
      if (!provider) {
        return res.status(404).json({ message: 'Provider profile not found' });
      }
      
      appointments = await prisma.appointment.findMany({
        where: { providerId: provider.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          service: true
        }
      });
    } else {
      // Clients see their own appointments
      appointments = await prisma.appointment.findMany({
        where: { userId },
        include: {
          service: true,
          provider: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                }
              }
            }
          }
        }
      });
    }
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
});

// Create appointment
router.post('/', authorize(['CLIENT', 'ADMIN']), async (req, res) => {
  try {
    const validatedData = appointmentSchema.parse(req.body);
    
    const appointment = await prisma.appointment.create({
      data: {
        date: validatedData.date,
        appointmentType: validatedData.appointmentType,
        userId: req.user!.userId,
        serviceId: validatedData.serviceId,
        providerId: validatedData.providerId,
      }
    });
    
    res.status(201).json(appointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error while creating appointment' });
  }
});

// Get appointment by ID
router.get('/:id', authorize(), async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        service: true,
        provider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        messages: true
      }
    });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if user has access to this appointment
    const { role, userId } = req.user!;
    const isProvider = appointment.provider.userId === userId;
    const isClient = appointment.userId === userId;
    
    if (role !== 'ADMIN' && !isProvider && !isClient) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Server error while fetching appointment' });
  }
});

// Update appointment status
router.patch('/:id/status', authorize(), async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: {
        provider: true
      }
    });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if user has access to update this appointment
    const { role, userId } = req.user!;
    const isProvider = appointment.provider.userId === userId;
    const isClient = appointment.userId === userId;
    
    if (role !== 'ADMIN' && !isProvider && (status !== 'CANCELLED' || !isClient)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updatedAppointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status }
    });
    
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: 'Server error while updating appointment status' });
  }
});

export default router;
