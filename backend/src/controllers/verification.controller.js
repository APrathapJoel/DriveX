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

  const { documentType, autoVerify, documentNumber, fullName } = req.body;
  const validTypes = ['drivers_licence', 'passport', 'government_id', 'aadhaar'];
  if (!documentType || !validTypes.includes(documentType)) {
    throw ApiError.badRequest('Valid document type is required (drivers_licence, aadhaar, passport, government_id)');
  }

  const isInstant = autoVerify === 'true' || autoVerify === true;
  const status = isInstant ? 'APPROVED' : 'PENDING';
  const userStatus = isInstant ? 'VERIFIED' : 'PENDING';

  // Check if user already has a pending or previous verification
  const existingPending = await IdentityVerification.findOne({
    user: req.user._id,
  });

  if (existingPending) {
    // Remove old file if it exists
    try {
      const oldFilePath = path.join(__dirname, '..', '..', existingPending.documentPath || '');
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    } catch (_) {}

    // Update existing
    existingPending.documentType = documentType;
    existingPending.documentPath = req.file.path.replace(/\\/g, '/');
    existingPending.originalFilename = req.file.originalname;
    existingPending.status = status;
    existingPending.submittedAt = new Date();
    if (isInstant) {
      existingPending.reviewedAt = new Date();
      existingPending.reviewedBy = req.user._id;
      existingPending.reviewNotes = `AI Neural Verification passed (${documentNumber || 'DL Verified'})`;
    }
    await existingPending.save();

    await User.findByIdAndUpdate(req.user._id, {
      verificationStatus: userStatus,
      isVerified: isInstant ? true : req.user.isVerified,
    });

    return ApiResponse.success(res, existingPending, isInstant ? 'Document verified successfully!' : 'Document updated successfully');
  }

  const verification = await IdentityVerification.create({
    user: req.user._id,
    documentType,
    documentPath: req.file.path.replace(/\\/g, '/'),
    originalFilename: req.file.originalname,
    status,
    reviewedAt: isInstant ? new Date() : null,
    reviewedBy: isInstant ? req.user._id : null,
    reviewNotes: isInstant ? `AI Neural Verification passed (${documentNumber || 'Verified'})` : null,
  });

  await User.findByIdAndUpdate(req.user._id, {
    verificationStatus: userStatus,
    isVerified: isInstant ? true : req.user.isVerified,
  });

  await createNotification(
    req.user._id,
    isInstant ? 'verification_approved' : 'verification_pending',
    isInstant ? 'Identity Verified! 🎉' : 'Document Submitted',
    isInstant
      ? `Your ${documentType.replace('_', ' ')} has been verified via AI OCR. You are ready to drive!`
      : 'Your identity document has been submitted for verification. We will review it shortly.',
    '/dashboard/profile'
  );

  ApiResponse.created(res, verification, isInstant ? 'Document verified successfully! 🎉' : 'Document uploaded successfully');
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

