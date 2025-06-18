import express from 'express';
import * as planController from '../controllers/plan.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = express.Router();

// Public routes
router.get('/', planController.getAllPlans);
router.get('/:id', planController.getPlanById);

// Protected user routes
router.post('/subscribe', protect, planController.subscribeToPlan);
router.get('/subscriptions/me', protect, planController.getUserSubscriptions);
router.post('/payment-intent', protect, planController.createPlanPaymentIntent);

// Admin routes
router.use(protect);
router.use(restrictTo(UserRole.ADMIN));

router.post('/', planController.createPlan);
router.put('/:id', planController.updatePlan);
router.delete('/:id', planController.deletePlan);
router.get('/subscriptions/all', planController.getAllSubscriptions);
router.put('/subscriptions/:id', planController.updateSubscriptionStatus);

export default router;