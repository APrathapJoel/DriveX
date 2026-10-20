import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { calculatePricing } from '../services/pricing.service.js';
import { createNotification } from '../services/notification.service.js';
import { ensureAutoSeeded } from '../utils/autoSeed.js';

/**
 * @desc    Create booking
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = asyncHandler(async (req, res) => {
  await ensureAutoSeeded();
  const { vehicleId, startDate, endDate, pickupLocation } = req.body;

  if (!vehicleId || !startDate || !endDate) {
    throw ApiError.badRequest('Vehicle, start date, and end date are required');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    throw ApiError.badRequest('End date must be after start date');
  }

  if (start < new Date()) {
    throw ApiError.badRequest('Start date cannot be in the past');
  }

  // Get vehicle
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw ApiError.notFound('Vehicle not found');
  }

  if (!vehicle.isAvailable) {
    throw ApiError.badRequest('Vehicle is currently not available');
  }

  // Final availability check (race condition guard)
  const overlappingBooking = await Booking.findOne({
    vehicle: vehicleId,
    status: { $in: ['pending', 'confirmed', 'active'] },
    startDate: { $lt: end },
    endDate: { $gt: start },
  });

  if (overlappingBooking) {
    throw ApiError.conflict('Vehicle is already booked for the selected dates');
  }

  // Calculate pricing on backend (authoritative)
  const pricing = calculatePricing(vehicle, start, end);

  const booking = await Booking.create({
    user: req.user._id,
    vehicle: vehicleId,
    startDate: start,
    endDate: end,
    pickupLocation: pickupLocation || vehicle.location,
    pricing,
    status: 'pending',
    paymentStatus: 'pending',
  });

  // Populate vehicle info
  await booking.populate('vehicle', 'brand model category images location');

  // Check verification status and create reminder
  const user = await User.findById(req.user._id);
  if (user.verificationStatus !== 'VERIFIED') {
    await createNotification(
      req.user._id,
      'verification_reminder',
      'Identity Verification Required',
      'Your booking has been created, but please verify your identity before your rental begins. Vehicle handover requires verified ID.',
      '/dashboard/verification'
    );
  }

  // Booking confirmation notification
  await createNotification(
    req.user._id,
    'booking_confirmed',
    'Booking Created',
    `Your booking for ${vehicle.brand} ${vehicle.model} has been created. Complete payment to confirm.`,
    `/dashboard/bookings/${booking._id}`
  );

  ApiResponse.created(res, booking, 'Booking created successfully');
});

/**
 * @desc    Get user's bookings
 * @route   GET /api/bookings/my
 * @access  Private
 */
export const getMyBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const query = { user: req.user._id };
  if (status) query.status = status;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate('vehicle', 'brand model category images location pricePerDay')
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
 * @desc    Get single booking
 * @route   GET /api/bookings/:id
 * @access  Private
 */
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('vehicle')
    .populate('user', 'name email phone verificationStatus');

  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }

  // Users can only view their own bookings (admins can view all)
  if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized to view this booking');
  }

  ApiResponse.success(res, booking);
});

/**
 * @desc    Cancel booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('Not authorized to cancel this booking');
  }

  if (['completed', 'cancelled', 'active'].includes(booking.status)) {
    throw ApiError.badRequest(`Cannot cancel a booking that is ${booking.status}`);
  }

  booking.status = 'cancelled';
  booking.cancellationReason = req.body.reason || 'Cancelled by user';
  booking.cancelledAt = new Date();

  // If payment was made, mark for refund
  if (booking.paymentStatus === 'successful') {
    booking.paymentStatus = 'refunded';
  }

  await booking.save();

  await createNotification(
    booking.user,
    'booking_cancelled',
    'Booking Cancelled',
    'Your booking has been cancelled.',
    `/dashboard/bookings/${booking._id}`
  );

  ApiResponse.success(res, booking, 'Booking cancelled successfully');
});

/**
 * @desc    Get price estimate
 * @route   POST /api/bookings/estimate
 * @access  Public
 */
export const getPriceEstimate = asyncHandler(async (req, res) => {
  await ensureAutoSeeded();
  const { vehicleId, startDate, endDate } = req.body;

  if (!vehicleId || !startDate || !endDate) {
    throw ApiError.badRequest('Vehicle, start date, and end date are required');
  }

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw ApiError.notFound('Vehicle not found');
  }

  const pricing = calculatePricing(vehicle, new Date(startDate), new Date(endDate));

  ApiResponse.success(res, {
    vehicle: { brand: vehicle.brand, model: vehicle.model, pricePerDay: vehicle.pricePerDay, pricePerHour: vehicle.pricePerHour },
    pricing,
  });
});
