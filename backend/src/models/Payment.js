import { BaseFirestoreModel } from './FirestoreModel.js';

class PaymentModel extends BaseFirestoreModel {
  constructor() {
    super('payments');
  }

  async create(data) {
    const paymentData = {
      currency: 'INR',
      status: 'pending',
      ...data,
    };
    return super.create(paymentData);
  }
}

const Payment = new PaymentModel();
export default Payment;
