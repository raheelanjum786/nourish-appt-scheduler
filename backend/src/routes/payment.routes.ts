import express from 'express';
import * as paymentController from '../controllers/payment.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model'; 

const router = express.Router();

router.get('/me', protect, paymentController.getPaymentHistory);
router.post('/me/:id/refund', protect, paymentController.requestRefund);

router.route('/')
  .get(protect, restrictTo(UserRole.ADMIN), paymentController.getAllPayments);

router.route('/:id')
  .get(protect, restrictTo(UserRole.ADMIN), paymentController.getPaymentById)
  .put(protect, restrictTo(UserRole.ADMIN), paymentController.updatePaymentStatus)
  .delete(protect, restrictTo(UserRole.ADMIN), paymentController.deletePayment);

export default router;