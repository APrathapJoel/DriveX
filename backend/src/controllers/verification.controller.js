import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import IdentityVerification from '../models/IdentityVerification.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotification } from '../services/notification.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Upload identity document
 * @route   POST /api/verification/upload
 * @access  Private
 */
export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('Please upload a document');
  }

  const { documentType } = req.body;
  if (!documentType || !['drivers_licence', 'passport', 'government_id'].includes(documentType)) {
    throw ApiError.badRequest('Valid document type is required');
  }

  // Check if user already has a pending verification
  const existingPending = await IdentityVerification.findOne({
    user: req.user._id,
    status: 'PENDING',
  });

  if (existingPending) {
    // Remove old file
    const oldFilePath = path.join(__dirname, '..', '..', existingPending.documentPath);
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
    // Update existing
    existingPending.documentType = documentType;
    existingPending.documentPath = req.file.path.replace(/\\/g, '/');
    existingPending.originalFilename = req.file.originalname;
    existingPending.submittedAt = new Date();
    await existingPending.save();

    await User.findByIdAndUpdate(req.user._id, { verificationStatus: 'PENDING' });

    return ApiResponse.success(res, existingPending, 'Document updated successfully');
  }

  const verification = await IdentityVerification.create({
    user: req.user._id,
    documentType,
    documentPath: req.file.path.replace(/\\/g, '/'),
    originalFilename: req.file.originalname,
    status: 'PENDING',
  });

  await User.findByIdAndUpdate(req.user._id, { verificationStatus: 'PENDING' });

  await createNotification(
    req.user._id,
    'verification_pending',
    'Document Submitted',
    'Your identity document has been submitted for verification. We will review it shortly.',
    '/dashboard/verification'
  );

  ApiResponse.created(res, verification, 'Document uploaded successfully');
});

/**
 * @desc    Get user's verification status
 * @route   GET /api/verification/status
 * @access  Private
 */
export const getVerificationStatus = asyncHandler(async (req, res) => {
  const verification = await IdentityVerification.findOne({ user: req.user._id })
    .sort({ createdAt: -1 });

  const user = await User.findById(req.user._id);

  ApiResponse.success(res, {
    verificationStatus: user.verificationStatus,
    latestSubmission: verification || null,
  });
});

/**
 * @desc    Serve document file (admin only, authenticated)
 * @route   GET /api/verification/document/:id
 * @access  Private/Admin
 */
export const getDocument = asyncHandler(async (req, res) => {
  const verification = await IdentityVerification.findById(req.params.id);
  if (!verification) {
    throw ApiError.notFound('Document not found');
  }

  const filePath = path.resolve(verification.documentPath);
  if (!fs.existsSync(filePath)) {
    throw ApiError.notFound('Document file not found');
  }

  res.sendFile(filePath);
});

/**
 * @desc    Simulate instant AI KYC verification & approval (gimmick flow)
 * @route   POST /api/verification/quick-verify
 * @access  Private
 */
export const quickVerify = asyncHandler(async (req, res) => {
  const { documentType = 'drivers_licence', documentNumber = 'DL-0420110012345', fullName } = req.body;

  const verification = await IdentityVerification.create({
    user: req.user._id,
    documentType,
    documentPath: `/uploads/kyc_${documentType}.png`,
    originalFilename: `verified_${documentType}.png`,
    status: 'APPROVED',
    reviewedBy: req.user._id,
    reviewedAt: new Date(),
    reviewNotes: `Auto-verified via AI Neural OCR (${documentNumber}) - Identity Confirmed`,
  });

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      isVerified: true,
      verificationStatus: 'VERIFIED',
    },
    { new: true }
  );

  await createNotification(
    req.user._id,
    'verification_approved',
    'KYC Identity Verified! 🎉',
    `Congratulations ${updatedUser?.name || 'Driver'}! Your ${documentType.replace('_', ' ')} has been verified. You can now drive any vehicle with zero deposit hold.`,
    '/dashboard/profile'
  );

  ApiResponse.success(res, {
    user: updatedUser,
    verification,
  }, 'Identity verified successfully!');
});

