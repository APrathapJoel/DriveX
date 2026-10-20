import { BaseFirestoreModel } from './FirestoreModel.js';

class NotificationModel extends BaseFirestoreModel {
  constructor() {
    super('notifications');
  }

  async create(data) {
    const notifData = {
      isRead: false,
      link: '',
      metadata: {},
      ...data,
    };
    return super.create(notifData);
  }
}

const Notification = new NotificationModel();
export default Notification;
