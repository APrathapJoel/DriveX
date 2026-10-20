import Notification from '../models/Notification.js';

/**
 * Create a notification for a user
 */
export const createNotification = async (userId, type, title, message, link = '', metadata = {}) => {
  try {
    await Notification.create({
      user: userId,
      type,
      title,
      message,
      link,
      metadata,
    });
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};
