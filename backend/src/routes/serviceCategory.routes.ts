import express from 'express';
import * as serviceCategoryController from '../controllers/serviceCategory.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = express.Router();

// Public routes
router.get('/', serviceCategoryController.getAllServiceCategories);
router.get('/:id', serviceCategoryController.getServiceCategoryById);
router.get('/:categoryId/services', serviceCategoryController.getServicesByCategory);

// Admin routes
router.post('/', protect, restrictTo(UserRole.ADMIN), serviceCategoryController.createServiceCategory);
router.put('/:id', protect, restrictTo(UserRole.ADMIN), serviceCategoryController.updateServiceCategory);
router.delete('/:id', protect, restrictTo(UserRole.ADMIN), serviceCategoryController.deleteServiceCategory);

export default router;