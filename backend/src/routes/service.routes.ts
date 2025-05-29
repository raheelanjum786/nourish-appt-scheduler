import express from 'express';
import * as serviceController from '../controllers/service.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = express.Router();

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

router.post('/', protect, restrictTo(UserRole.ADMIN), serviceController.createService);
router.put('/:id', protect, restrictTo(UserRole.ADMIN), serviceController.updateService);
router.delete('/:id', protect, restrictTo(UserRole.ADMIN), serviceController.deleteService);

export default router;