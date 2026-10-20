import { BaseFirestoreModel } from './FirestoreModel.js';

class ReviewModel extends BaseFirestoreModel {
  constructor() {
    super('reviews');
  }

  async create(data) {
    const reviewData = {
      comment: '',
      ...data,
    };
    return super.create(reviewData);
  }
}

const Review = new ReviewModel();
export default Review;
