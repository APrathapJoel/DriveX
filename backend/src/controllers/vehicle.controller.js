import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all vehicles with filtering, sorting, pagination
 * @route   GET /api/vehicles
 * @access  Public
 */
export const getVehicles = asyncHandler(async (req, res) => {
  const {
    search,
    brand,
    category,
    fuelType,
    transmission,
    seats,
    location,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};

  // Search by brand or model
  if (search) {
    query.$or = [
      { brand: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } },
    ];
  }

  // Filters
  if (brand) {
    const brands = brand.split(',');
    query.brand = { $in: brands };
  }
  if (category) {
    const categories = category.split(',');
    query.category = { $in: categories };
  }
  if (fuelType) {
    const fuels = fuelType.split(',');
    query.fuelType = { $in: fuels };
  }
  if (transmission) query.transmission = transmission;
  if (seats) query.seats = { $gte: parseInt(seats) };
  if (location) query.location = { $regex: location, $options: 'i' };
  if (minPrice || maxPrice) {
    query.pricePerDay = {};
    if (minPrice) query.pricePerDay.$gte = parseInt(minPrice);
    if (maxPrice) query.pricePerDay.$lte = parseInt(maxPrice);
  }

  // Only show available vehicles to non-admin
  query.isAvailable = true;

  // Sorting
  let sortQuery = { createdAt: -1 };
  if (sort === 'price_asc') sortQuery = { pricePerDay: 1 };
  else if (sort === 'price_desc') sortQuery = { pricePerDay: -1 };
  else if (sort === 'rating') sortQuery = { rating: -1 };
  else if (sort === 'popular') sortQuery = { reviewCount: -1 };

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [vehicles, total] = await Promise.all([
    Vehicle.find(query).sort(sortQuery).skip(skip).limit(limitNum),
    Vehicle.countDocuments(query),
  ]);

  ApiResponse.paginated(res, vehicles, {
    total,
    page: pageNum,
    limit: limitNum,
    pages: Math.ceil(total / limitNum),
  });
});

/**
 * @desc    Get single vehicle
 * @route   GET /api/vehicles/:id
 * @access  Public
 */
export const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    throw ApiError.notFound('Vehicle not found');
  }
  ApiResponse.success(res, vehicle);
});

/**
 * @desc    Check vehicle availability
 * @route   GET /api/vehicles/:id/availability
 * @access  Public
 */
export const checkAvailability = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    throw ApiError.badRequest('Start date and end date are required');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    throw ApiError.badRequest('End date must be after start date');
  }

  if (start < new Date()) {
    throw ApiError.badRequest('Start date cannot be in the past');
  }

  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    throw ApiError.notFound('Vehicle not found');
  }

  if (!vehicle.isAvailable) {
    return ApiResponse.success(res, {
      available: false,
      reason: 'Vehicle is currently not available for rental',
    });
  }

  // Check for overlapping bookings
  const overlappingBooking = await Booking.findOne({
    vehicle: req.params.id,
    status: { $in: ['pending', 'confirmed', 'active'] },
    $or: [
      { startDate: { $lt: end }, endDate: { $gt: start } },
    ],
  });

  const available = !overlappingBooking;

  ApiResponse.success(res, {
    available,
    reason: available ? 'Vehicle is available for the selected dates' : 'Vehicle is already booked for the selected dates',
  });
});

/**
 * @desc    Create vehicle (Admin)
 * @route   POST /api/vehicles
 * @access  Private/Admin
 */
export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.create(req.body);
  ApiResponse.created(res, vehicle, 'Vehicle added successfully');
});

/**
 * @desc    Update vehicle (Admin)
 * @route   PUT /api/vehicles/:id
 * @access  Private/Admin
 */
export const updateVehicle = asyncHandler(async (req, res) => {
  let vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    throw ApiError.notFound('Vehicle not found');
  }

  vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  ApiResponse.success(res, vehicle, 'Vehicle updated successfully');
});

/**
 * @desc    Delete vehicle (Admin)
 * @route   DELETE /api/vehicles/:id
 * @access  Private/Admin
 */
export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    throw ApiError.notFound('Vehicle not found');
  }

  // Check for active bookings
  const activeBookings = await Booking.countDocuments({
    vehicle: req.params.id,
    status: { $in: ['confirmed', 'active'] },
  });

  if (activeBookings > 0) {
    throw ApiError.badRequest('Cannot delete a vehicle with active bookings');
  }

  await Vehicle.findByIdAndDelete(req.params.id);
  ApiResponse.success(res, null, 'Vehicle deleted successfully');
});

/**
 * @desc    Get vehicle reviews
 * @route   GET /api/vehicles/:id/reviews
 * @access  Public
 */
export const getVehicleReviews = asyncHandler(async (req, res) => {
  const { default: Review } = await import('../models/Review.js');

  const reviews = await Review.find({ vehicle: req.params.id })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

  ApiResponse.success(res, reviews);
});
