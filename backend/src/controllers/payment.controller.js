import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotification } from '../services/notification.service.js';

/**
 * @desc    Create payment for booking (internal flow for MVP)
 * @route   POST /api/payments/create
 * @access  Private
 */
export const createPayment = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId).populate('vehicle', 'brand model');
  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }

  const bookingUserId = typeof booking.user === 'object' && booking.user?._id ? booking.user._id : booking.user;
  if (bookingUserId?.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized');
  }

  if (booking.paymentStatus === 'successful') {
    throw ApiError.badRequest('Payment already completed for this booking');
  }

  // Check for existing pending payment
  let payment = await Payment.findOne({ booking: bookingId, status: 'pending' });

  if (!payment) {
    payment = await Payment.create({
      booking: bookingId,
      user: req.user._id,
      amount: booking.pricing.totalAmount,
      currency: 'INR',
      provider: 'internal',
      status: 'pending',
    });
  }

  ApiResponse.success(res, {
    payment,
    booking: {
      _id: booking._id,
      vehicle: booking.vehicle,
      totalAmount: booking.pricing.totalAmount,
    },
  }, 'Payment initiated');
});

/**
 * @desc    Verify/complete payment
 * @route   POST /api/payments/verify
 * @access  Private
 */
export const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId, bookingId } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw ApiError.notFound('Payment not found');
  }

  const paymentUserId = typeof payment.user === 'object' && payment.user?._id ? payment.user._id : payment.user;
  if (paymentUserId?.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized');
  }

  // In MVP, we simulate payment verification
  // In production, this would verify with Razorpay/Stripe
  payment.status = 'successful';
  payment.paidAt = new Date();
  payment.providerId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await payment.save();

  // Update booking
  const booking = await Booking.findById(bookingId || payment.booking).populate('vehicle', 'brand model');
  if (booking) {
    booking.status = 'confirmed';
    booking.paymentStatus = 'successful';
    booking.paymentId = payment.providerId;
    await booking.save();

    await createNotification(
      req.user._id,
      'payment_success',
      'Payment Successful',
      `Payment of ₹${payment.amount.toLocaleString()} for ${booking.vehicle.brand} ${booking.vehicle.model} was successful. Your booking is confirmed!`,
      `/dashboard/bookings/${booking._id}`
    );
  }

  ApiResponse.success(res, { payment, booking }, 'Payment verified successfully');
});

/**
 * @desc    Get user's payments
 * @route   GET /api/payments/my
 * @access  Private
 */
export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id })
    .populate('booking', 'startDate endDate status')
    .sort({ createdAt: -1 });

  ApiResponse.success(res, payments);
});
