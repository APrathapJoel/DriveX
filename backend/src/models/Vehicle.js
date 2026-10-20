import { BaseFirestoreModel } from './FirestoreModel.js';

class VehicleModel extends BaseFirestoreModel {
  constructor() {
    super('vehicles');
  }

  async create(data) {
    const vehicleData = {
      isAvailable: true,
      rating: 0,
      reviewCount: 0,
      features: [],
      images: [],
      ...data,
    };
    return super.create(vehicleData);
  }
}

const Vehicle = new VehicleModel();
export default Vehicle;
