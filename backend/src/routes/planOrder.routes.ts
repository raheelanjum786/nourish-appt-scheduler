import express from 'express';
import { createPlanOrder, getUserPlanOrders, getAllPlanOrders, getPlanOrderById, updatePlanOrder, deletePlanOrder } from '../controllers/planOrderController';
import { protect, restrictTo } from '../middleware/auth.middleware'; 
import { UserRole } from '../models/user.model';

const router = express.Router();

router.route('/').post(protect, createPlanOrder);
router.route('/user/:userId').get(getUserPlanOrders); 

router.route('/admin').get(protect, restrictTo(UserRole.ADMIN) ,getAllPlanOrders);
router.route('/admin/:id').get(protect, restrictTo(UserRole.ADMIN) ,getPlanOrderById).put(protect, restrictTo(UserRole.ADMIN) ,updatePlanOrder).delete(protect, restrictTo(UserRole.ADMIN) ,deletePlanOrder); 

export default router;