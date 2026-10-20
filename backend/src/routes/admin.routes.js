import { Router } from 'express';
import {
  getDashboardStats,
  getUsers,
  getAllBookings,
  getVerificationQueue,
  getVerification,
  approveVerification,
  rejectVerification,
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getUsers);
router.get('/bookings', getAllBookings);
router.get('/verifications', getVerificationQueue);
router.get('/verifications/:id', getVerification);
router.put('/verifications/:id/approve', approveVerification);
router.put('/verifications/:id/reject', rejectVerification);

export default router;
