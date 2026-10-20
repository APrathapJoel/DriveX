import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import config from '../config/index.js';
import { ensureAutoSeeded } from '../utils/autoSeed.js';

/**
 * Protect routes - verify JWT token
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check cookie first, then Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw ApiError.unauthorized('Not authorized. Please log in.');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    await ensureAutoSeeded();

    let user = await User.findById(decoded.id);

    // If not found by ID, try email
    if (!user && decoded.email) {
      user = await User.findOne({ email: decoded.email });
    }

    // In serverless fallback environment: if token is authentic & signed by our secret,
    // restore the user record into the active store so subsequent queries/bookings succeed
    if (!user && decoded.id) {
      console.log(`[Auth] Restoring session user for ID ${decoded.id} (${decoded.email || 'customer'})...`);
      user = await User.create({
        _id: decoded.id,
        id: decoded.id,
        name: decoded.name || 'DriveR Member',
        email: decoded.email || `customer_${String(decoded.id).slice(0, 8)}@driver.com`,
        role: decoded.role || 'customer',
        isVerified: decoded.isVerified ?? true,
        verificationStatus: decoded.isVerified ? 'VERIFIED' : 'PENDING',
      });
    }

    if (!user) {
      throw ApiError.unauthorized('User no longer exists. Please log in again.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.isOperational) throw error;
    throw ApiError.unauthorized('Not authorized. Invalid token.');
  }
});

/**
 * Authorize by role
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(`Role '${req.user.role}' is not authorized to access this resource`);
    }
    next();
  };
};
