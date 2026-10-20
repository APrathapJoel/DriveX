import { Router } from 'express';
import { uploadDocument, getVerificationStatus, getDocument } from '../controllers/verification.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadIdDocument } from '../middleware/upload.js';

const router = Router();

router.post('/upload', protect, uploadIdDocument.single('document'), uploadDocument);
router.get('/status', protect, getVerificationStatus);
router.get('/document/:id', protect, authorize('admin'), getDocument);

export default router;
