import express from 'express';
import * as timeSlotController from '../controllers/timeSlot.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = express.Router();

// Public routes
router.get('/available', timeSlotController.getAvailableTimeSlots);

// Protected routes (admin only)
router.get('/', protect, restrictTo(UserRole.ADMIN), timeSlotController.getAllTimeSlots);
router.get('/:id', protect, restrictTo(UserRole.ADMIN), timeSlotController.getTimeSlotById);
router.post('/', protect, restrictTo(UserRole.ADMIN), timeSlotController.createTimeSlot);
router.post('/bulk', protect, restrictTo(UserRole.ADMIN), timeSlotController.createBulkTimeSlots);
router.put('/:id', protect, restrictTo(UserRole.ADMIN), timeSlotController.updateTimeSlot);
router.delete('/:id', protect, restrictTo(UserRole.ADMIN), timeSlotController.deleteTimeSlot);

// Booking related routes
router.post('/book', protect, timeSlotController.bookTimeSlot);
router.post('/release', protect, restrictTo(UserRole.ADMIN), timeSlotController.releaseTimeSlot);

router.post('/generate', protect, restrictTo(UserRole.ADMIN), timeSlotController.generateTimeSlotsForService);

// Generate time slots for all services
router.post('/generate-all', protect,restrictTo(UserRole.ADMIN), timeSlotController.generateTimeSlotsForAllServices);

export default router;