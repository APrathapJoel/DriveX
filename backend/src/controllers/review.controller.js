import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Create review
 * @route   POST /api/reviews
 * @access  Private
 */
export const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  if (!bookingId || !rating) {
    throw ApiError.badRequest('Booking ID and rating are required');
  }

  // Verify booking belongs to user and is completed
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Not authorized');
  }

  if (booking.status !== 'completed') {
    throw ApiError.badRequest('You can only review completed rentals');
  }

  // Check for existing review
  const existingReview = await Review.findOne({ booking: bookingId });
  if (existingReview) {
    throw ApiError.conflict('You have already reviewed this booking');
  }

  const review = await Review.create({
    user: req.user._id,
    vehicle: booking.vehicle,
    booking: bookingId,
    rating,
    comment: comment || '',
  });

  // Update vehicle rating
  const reviews = await Review.find({ vehicle: booking.vehicle });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Vehicle.findByIdAndUpdate(booking.vehicle, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length,
  });

  await review.populate('user', 'name avatar');

  ApiResponse.created(res, review, 'Review submitted successfully');
});
