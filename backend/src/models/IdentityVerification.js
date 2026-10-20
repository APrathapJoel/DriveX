import { BaseFirestoreModel } from './FirestoreModel.js';

class IdentityVerificationModel extends BaseFirestoreModel {
  constructor() {
    super('identity_verifications');
  }

  async create(data) {
    const verificationData = {
      status: 'PENDING',
      rejectionReason: '',
      submittedAt: new Date().toISOString(),
      ...data,
    };
    return super.create(verificationData);
  }
}

const IdentityVerification = new IdentityVerificationModel();
export default IdentityVerification;
