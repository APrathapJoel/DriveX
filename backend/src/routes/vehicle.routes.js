import { Router } from 'express';
import {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  checkAvailability,
  getVehicleReviews,
} from '../controllers/vehicle.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getVehicles);
router.get('/:id', getVehicle);
router.get('/:id/availability', checkAvailability);
router.get('/:id/reviews', getVehicleReviews);

// Admin only
router.post('/', protect, authorize('admin'), createVehicle);
router.put('/:id', protect, authorize('admin'), updateVehicle);
router.delete('/:id', protect, authorize('admin'), deleteVehicle);

export default router;
