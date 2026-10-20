import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import { vehicles as seedVehicles } from '../vehicleCatalog.js';

let isSeeding = false;
let seededAt = 0;

export async function ensureAutoSeeded() {
  // If seeded within the last 5 minutes in this process, skip check
  if (Date.now() - seededAt < 300000 && seededAt > 0) return;
  if (isSeeding) return;

  try {
    isSeeding = true;

    // 1. Ensure vehicles seeded
    const vehicleCount = await Vehicle.countDocuments();
    if (vehicleCount === 0 && seedVehicles && seedVehicles.length > 0) {
      console.log(`[AutoSeed] Seeding ${seedVehicles.length} vehicles into database...`);
      await Vehicle.insertMany(seedVehicles);
      console.log('[AutoSeed] Vehicles seeded successfully!');
    }

    // 2. Ensure default users seeded
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[AutoSeed] Seeding default accounts (admin & demo customer)...');
      await User.create({
        name: 'Admin User',
        email: 'admin@drivex.com',
        password: 'admin123',
        phone: '+91 9876543210',
        role: 'admin',
        isVerified: true,
        verificationStatus: 'VERIFIED',
      });

      await User.create({
        name: 'Admin User',
        email: 'admin@driver.com',
        password: 'admin123',
        phone: '+91 9876543210',
        role: 'admin',
        isVerified: true,
        verificationStatus: 'VERIFIED',
      });

      await User.create({
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'customer123',
        phone: '+91 9876543211',
        role: 'customer',
        isVerified: true,
        verificationStatus: 'VERIFIED',
      });

      await User.create({
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: 'customer123',
        phone: '+91 9876543212',
        role: 'customer',
        isVerified: false,
        verificationStatus: 'NOT_SUBMITTED',
      });
      console.log('[AutoSeed] Default users seeded successfully!');
    }

    seededAt = Date.now();
  } catch (err) {
    console.warn('[AutoSeed] Warning during auto-seeding:', err.message);
  } finally {
    isSeeding = false;
  }
}
