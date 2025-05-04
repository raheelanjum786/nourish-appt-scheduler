
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authorize } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all users (admin only)
router.get('/', authorize(['ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// Get user by ID
router.get('/:id', authorize(), async (req, res) => {
  try {
    // Users can only access their own data unless they're admins
    if (req.user!.role !== 'ADMIN' && req.user!.userId !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
});

// Update user
router.put('/:id', authorize(), async (req, res) => {
  try {
    // Users can only update their own data unless they're admins
    if (req.user!.role !== 'ADMIN' && req.user!.userId !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { name, email, role } = req.body;
    
    // Only admins can change roles
    if (role && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to change user roles' });
    }
    
    // If trying to update email, check if it's already taken
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser && existingUser.id !== req.params.id) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role && req.user!.role === 'ADMIN') updateData.role = role;
    
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error while updating user' });
  }
});

// Delete user (admin only or self)
router.delete('/:id', authorize(), async (req, res) => {
  try {
    // Users can only delete their own account unless they're admins
    if (req.user!.role !== 'ADMIN' && req.user!.userId !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await prisma.user.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
});

export default router;
