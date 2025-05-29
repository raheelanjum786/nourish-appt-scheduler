import express from 'express';
import * as appointmentController from '../controllers/appointment.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';
import { createPaymentIntent } from "../controllers/appointment.controller";

const router = express.Router();

router.get('/available-slots', appointmentController.getAvailableTimeSlots);

router.post('/', protect, appointmentController.createAppointment);
router.get('/me', protect, appointmentController.getUserAppointments);
router.get('/me/:id', protect, appointmentController.getUserAppointmentById);
router.put('/me/:id/cancel', protect, appointmentController.cancelUserAppointment);

router.post('/create-payment-intent', protect, createPaymentIntent);

router.get('/', protect, restrictTo(UserRole.ADMIN), appointmentController.getAllAppointments);
router.get('/:id', protect, restrictTo(UserRole.ADMIN), appointmentController.getAppointmentById);
router.put('/:id', protect, restrictTo(UserRole.ADMIN), appointmentController.updateAppointmentStatus);
router.delete('/:id', protect, restrictTo(UserRole.ADMIN), appointmentController.deleteAppointment);

export default router;