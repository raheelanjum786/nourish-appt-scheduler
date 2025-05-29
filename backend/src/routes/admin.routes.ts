import express from 'express';
import { 
  getDashboardStats, 
  getRecentAppointments, 
  getRecentUsers,
  manageService,
  manageUser,
  bulkManageUsers,
  getServiceCategories,
  updateServiceCategories,
  getFilteredAppointments
} from '../controllers/admin.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = express.Router();

router.use(protect);
router.use(restrictTo(UserRole.ADMIN));

router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/recent-appointments', getRecentAppointments);
router.get('/dashboard/recent-users', getRecentUsers);

router.post('/users/bulk', bulkManageUsers);
router.route('/service-categories')
  .get(getServiceCategories)
  .put(updateServiceCategories);
router.get('/appointments/filter', getFilteredAppointments);
// Service management
router.route('/services/:id')
  .put(manageService)
  .delete(manageService);

router.route('/users/:id')
  .put(manageUser)
  .delete(manageUser);




export default router;