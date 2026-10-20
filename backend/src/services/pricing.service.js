/**
 * Pricing service - authoritative price calculation on the backend
 */

const TAX_RATE = 0.18; // 18% GST
const SERVICE_FEE_RATE = 0.05; // 5% service fee

/**
 * Calculate rental duration in days and remaining hours
 */
export const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  const totalHours = diffMs / (1000 * 60 * 60);
  const days = Math.floor(totalHours / 24);
  const hours = Math.ceil(totalHours % 24);

  return { days, hours, totalHours };
};

/**
 * Calculate full pricing breakdown
 */
export const calculatePricing = (vehicle, startDate, endDate) => {
  const { days, hours, totalHours } = calculateDuration(startDate, endDate);

  let baseAmount = 0;

  if (days > 0) {
    baseAmount += days * vehicle.pricePerDay;
  }

  if (hours > 0) {
    baseAmount += hours * vehicle.pricePerHour;
  }

  // Minimum charge of 1 hour
  if (baseAmount === 0) {
    baseAmount = vehicle.pricePerHour;
  }

  const serviceFee = Math.round(baseAmount * SERVICE_FEE_RATE);
  const taxableAmount = baseAmount + serviceFee;
  const tax = Math.round(taxableAmount * TAX_RATE);
  const totalAmount = baseAmount + serviceFee + tax;

  return {
    baseAmount,
    serviceFee,
    tax,
    discount: 0,
    totalAmount,
    rentalDays: days,
    rentalHours: hours,
  };
};
