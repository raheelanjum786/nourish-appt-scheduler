import express from 'express';
import * as userController from '../controllers/user.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = express.Router();

router.get('/me', protect, userController.getCurrentUser);

router.put('/me', protect, userController.updateCurrentUser);

router.get('/', protect, restrictTo(UserRole.ADMIN), userController.getAllUsers);
router.get('/:id', protect, restrictTo(UserRole.ADMIN), userController.getUserById);
router.put('/:id', protect, restrictTo(UserRole.ADMIN), userController.updateUser);
router.delete('/:id', protect, restrictTo(UserRole.ADMIN), userController.deleteUser);

router.get('/payments/history', userController.getPaymentHistory);
// router.post('/payments/:id/refund', userController.requestRefund);

router.get('/services/:id/availability', userController.checkServiceAvailability);

router.put('/appointments/:id/reschedule', userController.rescheduleAppointment);

export default router;