import { Router } from 'express';
import { createReview } from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, createReview);

export default router;
