import express from 'express';
import * as userController from '../controllers/user.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = express.Router();

// Get current user profile
router.get('/me', protect, userController.getCurrentUser);

// Update current user profile
router.put('/me', protect, userController.updateCurrentUser);

// Admin routes
router.get('/', protect, restrictTo(UserRole.ADMIN), userController.getAllUsers);
router.get('/:id', protect, restrictTo(UserRole.ADMIN), userController.getUserById);
router.put('/:id', protect, restrictTo(UserRole.ADMIN), userController.updateUser);
router.delete('/:id', protect, restrictTo(UserRole.ADMIN), userController.deleteUser);

export default router;