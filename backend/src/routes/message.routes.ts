import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = express.Router();


router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create message endpoint' });
});

router.use(protect, restrictTo(UserRole.ADMIN));

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all messages endpoint' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get message with ID: ${req.params.id}` });
});

router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update message with ID: ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ message: `Delete message with ID: ${req.params.id}` });
});

export default router;