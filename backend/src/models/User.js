import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { BaseFirestoreModel, ModelInstance } from './FirestoreModel.js';

class UserModelInstance extends ModelInstance {
  async comparePassword(candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
  }

  generateToken() {
    return jwt.sign(
      { id: this._id || this.id, role: this.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expire }
    );
  }
}

class UserModel extends BaseFirestoreModel {
  constructor() {
    super('users', UserModelInstance);
  }

  async create(data) {
    const userData = { ...data };
    if (userData.password) {
      const salt = await bcrypt.genSalt(12);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    if (!userData.role) userData.role = 'customer';
    if (userData.isVerified === undefined) userData.isVerified = false;
    if (!userData.verificationStatus) userData.verificationStatus = 'NOT_SUBMITTED';

    return super.create(userData);
  }
}

const User = new UserModel();
export default User;
