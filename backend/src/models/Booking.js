import { BaseFirestoreModel } from './FirestoreModel.js';

class BookingModel extends BaseFirestoreModel {
  constructor() {
    super('bookings');
  }

  async create(data) {
    const bookingData = {
      status: 'pending',
      paymentStatus: 'pending',
      ...data,
    };
    return super.create(bookingData);
  }
}

const Booking = new BookingModel();
export default Booking;
