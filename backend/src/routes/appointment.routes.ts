import express from 'express';
import * as appointmentController from '../controllers/appointment.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = express.Router();

// Public routes
router.get('/available-slots', appointmentController.getAvailableTimeSlots);

// User routes
router.post('/', protect, appointmentController.createAppointment);
router.get('/me', protect, appointmentController.getUserAppointments);
router.get('/me/:id', protect, appointmentController.getUserAppointmentById);
router.put('/me/:id/cancel', protect, appointmentController.cancelUserAppointment);

// Admin routes
router.get('/', protect, restrictTo(UserRole.ADMIN), appointmentController.getAllAppointments);
router.get('/:id', protect, restrictTo(UserRole.ADMIN), appointmentController.getAppointmentById);
router.put('/:id', protect, restrictTo(UserRole.ADMIN), appointmentController.updateAppointmentStatus);
router.delete('/:id', protect, restrictTo(UserRole.ADMIN), appointmentController.deleteAppointment);

export default router;