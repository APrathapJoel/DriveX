import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getPriceEstimate,
} from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/estimate', getPriceEstimate);
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
