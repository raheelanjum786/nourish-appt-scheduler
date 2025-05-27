import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = express.Router();

// Public route - no authentication required
// Create new message (contact form)
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create message endpoint' });
});

// Protected routes - Admin only
router.use(authMiddleware, roleMiddleware([UserRole.ADMIN]));

// Get all messages
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all messages endpoint' });
});

// Get message by ID
router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get message with ID: ${req.params.id}` });
});

// Update message (mark as read, etc.)
router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update message with ID: ${req.params.id}` });
});

// Delete message
router.delete('/:id', (req, res) => {
  res.status(200).json({ message: `Delete message with ID: ${req.params.id}` });
});

export default router;