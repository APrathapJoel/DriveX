import { initFirebase } from './firebase.js';

const connectDB = async () => {
  try {
    initFirebase();
  } catch (error) {
    console.error(`Firebase Initialization Error: ${error.message}`);
  }
};

export default connectDB;
