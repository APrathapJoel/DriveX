import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import IdentityVerification from '../models/IdentityVerification.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotification } from '../services/notification.service.js';

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalVehicles,
    availableVehicles,
    totalCustomers,
    totalUsers,
    totalBookings,
    pendingVerifications,
    bookingsByStatus,
    recentBookings,
    recentUsers,
    revenueData,
  ] = await Promise.all([
    Vehicle.countDocuments(),
    Vehicle.countDocuments({ isAvailable: true }),
    User.countDocuments({ role: 'customer' }),
    User.countDocuments(),
    Booking.countDocuments(),
    IdentityVerification.countDocuments({ status: 'PENDING' }),
    Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Booking.find()
      .populate('vehicle', 'brand model')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10),
    User.find()
      .sort({ createdAt: -1 })
      .limit(5),
    Payment.aggregate([
      { $match: { status: 'successful' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
  ]);

  // Category breakdown
  const categoryBreakdown = await Vehicle.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Monthly revenue (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Payment.aggregate([
    { $match: { status: 'successful', paidAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$paidAt' } },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Monthly bookings
  const monthlyBookings = await Booking.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const totalRev = revenueData[0]?.totalRevenue || 0;
  const totalPay = revenueData[0]?.count || 0;

  ApiResponse.success(res, {
    totalUsers,
    totalVehicles,
    totalBookings,
    totalRevenue: totalRev,
    recentBookings: recentBookings || [],
    recentUsers: recentUsers || [],
    stats: {
      totalUsers,
      totalVehicles,
      availableVehicles,
      totalCustomers,
      totalBookings,
      pendingVerifications,
      totalRevenue: totalRev,
      totalPayments: totalPay,
    },
    bookingsByStatus: bookingsByStatus.reduce((acc, b) => {
      acc[b._id] = b.count;
      return acc;
    }, {}),
    categoryBreakdown,
    monthlyRevenue,
    monthlyBookings,
  });
});

/**
 * @desc    Get all users (Admin)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) query.role = role;

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    User.countDocuments(query),
  ]);

  ApiResponse.paginated(res, users, {
    total,
    page: pageNum,
    limit: limitNum,
    pages: Math.ceil(total / limitNum),
  });
});

/**
 * @desc    Get all bookings (Admin)
 * @route   GET /api/admin/bookings
 * @access  Private/Admin
 */
export const getAllBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const query = {};
  if (status) query.status = status;

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate('vehicle', 'brand model category images')
      .populate('user', 'name email verificationStatus')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Booking.countDocuments(query),
  ]);

  ApiResponse.paginated(res, bookings, {
    total,
    page: pageNum,
    limit: limitNum,
    pages: Math.ceil(total / limitNum),
  });
});

/**
 * @desc    Get verification queue (Admin)
 * @route   GET /api/admin/verifications
 * @access  Private/Admin
 */
export const getVerificationQueue = asyncHandler(async (req, res) => {
  const { status = 'PENDING' } = req.query;

  const verifications = await IdentityVerification.find({ status })
    .populate('user', 'name email')
    .sort({ submittedAt: -1 });

  // Enrich with booking info for priority
  const enriched = await Promise.all(
    verifications.map(async (v) => {
      const upcomingBooking = await Booking.findOne({
        user: v.user._id,
        status: { $in: ['pending', 'confirmed'] },
        startDate: { $gte: new Date() },
      }).sort({ startDate: 1 });

      let priority = 'NORMAL';
      if (upcomingBooking) {
        const hoursUntilRental = (new Date(upcomingBooking.startDate) - new Date()) / (1000 * 60 * 60);
        if (hoursUntilRental <= 6) priority = 'HIGH';
        else if (hoursUntilRental <= 24) priority = 'MEDIUM';
      }

      return {
        ...v.toObject(),
        upcomingBooking: upcomingBooking
          ? { startDate: upcomingBooking.startDate, status: upcomingBooking.status }
          : null,
        priority,
      };
    })
  );

  // Sort by priority
  const priorityOrder = { HIGH: 0, MEDIUM: 1, NORMAL: 2 };
  enriched.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  ApiResponse.success(res, enriched);
});

/**
 * @desc    Get single verification (Admin)
 * @route   GET /api/admin/verifications/:id
 * @access  Private/Admin
 */
export const getVerification = asyncHandler(async (req, res) => {
  const verification = await IdentityVerification.findById(req.params.id)
    .populate('user', 'name email phone');

  if (!verification) {
    throw ApiError.notFound('Verification not found');
  }

  ApiResponse.success(res, verification);
});

/**
 * @desc    Approve verification (Admin)
 * @route   PUT /api/admin/verifications/:id/approve
 * @access  Private/Admin
 */
export const approveVerification = asyncHandler(async (req, res) => {
  const verification = await IdentityVerification.findById(req.params.id);
  if (!verification) {
    throw ApiError.notFound('Verification not found');
  }

  verification.status = 'VERIFIED';
  verification.reviewedBy = req.user._id;
  verification.reviewedAt = new Date();
  await verification.save();

  await User.findByIdAndUpdate(verification.user, {
    isVerified: true,
    verificationStatus: 'VERIFIED',
  });

  await createNotification(
    verification.user,
    'verification_approved',
    'Identity Verified',
    'Your identity document has been verified successfully. You are all set for your rental!',
    '/dashboard/verification'
  );

  ApiResponse.success(res, verification, 'Verification approved');
});

/**
 * @desc    Reject verification (Admin)
 * @route   PUT /api/admin/verifications/:id/reject
 * @access  Private/Admin
 */
export const rejectVerification = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  if (!reason) {
    throw ApiError.badRequest('Rejection reason is required');
  }

  const verification = await IdentityVerification.findById(req.params.id);
  if (!verification) {
    throw ApiError.notFound('Verification not found');
  }

  verification.status = 'REJECTED';
  verification.rejectionReason = reason;
  verification.reviewedBy = req.user._id;
  verification.reviewedAt = new Date();
  await verification.save();

  await User.findByIdAndUpdate(verification.user, {
    isVerified: false,
    verificationStatus: 'REJECTED',
  });

  await createNotification(
    verification.user,
    'verification_rejected',
    'Verification Rejected',
    `Your identity document was rejected. Reason: ${reason}. Please resubmit a valid document.`,
    '/dashboard/verification'
  );

  ApiResponse.success(res, verification, 'Verification rejected');
});
