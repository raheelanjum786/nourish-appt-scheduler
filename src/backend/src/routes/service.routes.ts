
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authorize } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Input validation schema
const serviceSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  image: z.string().url(),
  providerId: z.string().uuid().optional(),
});

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        provider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error while fetching services' });
  }
});

// Create service (admin or provider only)
router.post('/', authorize(['ADMIN', 'PROVIDER']), async (req, res) => {
  try {
    const validatedData = serviceSchema.parse(req.body);
    const { role, userId } = req.user!;
    
    let providerId = validatedData.providerId;
    
    // If provider is creating the service, use their provider ID
    if (role === 'PROVIDER') {
      const provider = await prisma.serviceProvider.findFirst({
        where: { userId }
      });
      
      if (!provider) {
        return res.status(404).json({ message: 'Provider profile not found' });
      }
      
      providerId = provider.id;
    } else if (!providerId) {
      // Admin must specify a provider
      return res.status(400).json({ message: 'Provider ID is required' });
    }
    
    const service = await prisma.service.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        image: validatedData.image,
        providerId: providerId!
      },
      include: {
        provider: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    
    res.status(201).json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server error while creating service' });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: {
        provider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Server error while fetching service' });
  }
});

// Update service (admin or provider only)
router.put('/:id', authorize(['ADMIN', 'PROVIDER']), async (req, res) => {
  try {
    const validatedData = serviceSchema.parse(req.body);
    const { role, userId } = req.user!;
    
    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: {
        provider: true
      }
    });
    
    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Check if user has permission to update this service
    if (role === 'PROVIDER') {
      const provider = await prisma.serviceProvider.findFirst({
        where: { userId }
      });
      
      if (!provider || provider.id !== existingService.providerId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    
    const updatedService = await prisma.service.update({
      where: { id: req.params.id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        image: validatedData.image
      }
    });
    
    res.json(updatedService);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
    }
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server error while updating service' });
  }
});

// Delete service (admin or provider only)
router.delete('/:id', authorize(['ADMIN', 'PROVIDER']), async (req, res) => {
  try {
    const { role, userId } = req.user!;
    
    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: {
        provider: true
      }
    });
    
    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Check if user has permission to delete this service
    if (role === 'PROVIDER') {
      const provider = await prisma.serviceProvider.findFirst({
        where: { userId }
      });
      
      if (!provider || provider.id !== existingService.providerId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    
    await prisma.service.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error while deleting service' });
  }
});

export default router;
