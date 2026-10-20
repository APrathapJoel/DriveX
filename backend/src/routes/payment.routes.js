import { Router } from 'express';
import { createPayment, verifyPayment, getMyPayments } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/create', protect, createPayment);
router.post('/verify', protect, verifyPayment);
router.get('/my', protect, getMyPayments);

export default router;
