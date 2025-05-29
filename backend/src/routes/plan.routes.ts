import express from 'express';
import { createPlan, getPlans, getPlanById, updatePlan, deletePlan, getUserPlans } from '../controllers/planController';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = express.Router();

router.route('/').post(protect, restrictTo(UserRole.ADMIN), createPlan).get(protect, restrictTo(UserRole.ADMIN), getPlans); 

router.route('/user').get(getUserPlans); 

router.route('/:id').get(protect, restrictTo(UserRole.ADMIN),getPlanById).put(protect, restrictTo(UserRole.ADMIN),updatePlan).delete(protect, restrictTo(UserRole.ADMIN),deletePlan); 

export default router;