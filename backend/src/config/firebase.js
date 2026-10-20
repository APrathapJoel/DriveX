import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import config from './index.js';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let firestoreInstance = null;
let isLive = false;

function getFirebaseAdmin() {
  try {
    const app = require('firebase-admin/app');
    const firestore = require('firebase-admin/firestore');
    return {
      initializeApp: app.initializeApp,
      cert: app.cert,
      getApps: app.getApps,
      getAdminFirestore: firestore.getFirestore,
    };
  } catch (err) {
    console.warn(`[Firebase] Notice: firebase-admin module could not be loaded (${err.message}). Using local store simulation.`);
    return null;
  }
}

// Check possible paths for serviceAccountKey.json
const possibleServiceAccountPaths = [
  path.resolve(__dirname, '..', '..', 'serviceAccountKey.json'),
  path.resolve(__dirname, 'serviceAccountKey.json'),
  path.resolve(process.cwd(), 'serviceAccountKey.json'),
  path.resolve(process.cwd(), 'backend', 'serviceAccountKey.json'),
];

if (config.firebase.serviceAccountPath) {
  possibleServiceAccountPaths.unshift(path.resolve(config.firebase.serviceAccountPath));
}

export function initFirebase() {
  if (firestoreInstance) {
    return { db: firestoreInstance, isLive };
  }

  const admin = getFirebaseAdmin();
  if (!admin) {
    isLive = false;
    return { db: null, isLive: false };
  }

  // 1. Check for Service Account JSON file
  for (const filePath of possibleServiceAccountPaths) {
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const serviceAccount = JSON.parse(fileContent);
        
        if (!admin.getApps().length) {
          admin.initializeApp({
            credential: admin.cert(serviceAccount),
          });
        }
        firestoreInstance = admin.getAdminFirestore();
        isLive = true;
        console.log(`\n🔥 [Firebase] Successfully connected to Google Cloud Firestore (Project: ${serviceAccount.project_id || 'Configured'})\n`);
        return { db: firestoreInstance, isLive };
      } catch (err) {
        console.warn(`[Firebase] Failed to load serviceAccount from ${filePath}: ${err.message}`);
      }
    }
  }

  // 2. Check for environment variables
  if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey) {
    try {
      if (!admin.getApps().length) {
        admin.initializeApp({
          credential: admin.cert({
            projectId: config.firebase.projectId,
            clientEmail: config.firebase.clientEmail,
            privateKey: config.firebase.privateKey,
          }),
        });
      }
      firestoreInstance = admin.getAdminFirestore();
      isLive = true;
      console.log(`\n🔥 [Firebase] Successfully connected to Google Cloud Firestore via env credentials (Project: ${config.firebase.projectId})\n`);
      return { db: firestoreInstance, isLive };
    } catch (err) {
      console.warn(`[Firebase] Failed to initialize with environment credentials: ${err.message}`);
    }
  }

  // 3. Check for Firestore Emulator
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    try {
      if (!admin.getApps().length) {
        admin.initializeApp({
          projectId: config.firebase.projectId || 'drivex-local',
        });
      }
      firestoreInstance = admin.getAdminFirestore();
      isLive = true;
      console.log(`\n🔥 [Firebase] Connected to Firestore Emulator at ${process.env.FIRESTORE_EMULATOR_HOST}\n`);
      return { db: firestoreInstance, isLive };
    } catch (err) {
      console.warn(`[Firebase] Failed to connect to emulator: ${err.message}`);
    }
  }

  // 4. Fallback local store
  console.log(`\n========================================================================`);
  console.log(`🔥 [Firebase Notice] No Google Cloud Firebase credentials detected.`);
  console.log(`   Running with local file-backed Firestore simulation (zero crash).`);
  console.log(`========================================================================\n`);

  isLive = false;
  return { db: null, isLive: false };
}

export const getFirestore = () => {
  const { db } = initFirebase();
  return db;
};

export const isLiveFirestore = () => isLive;

let noticeLogged = false;
export const disableLiveFirestore = (reason = '') => {
  isLive = false;
  if (reason && !noticeLogged) {
    noticeLogged = true;
    console.warn(`\n⚠️ [Firebase Notice] ${reason}\n👉 Using local file-backed store for current session.\n`);
  }
};

export default {
  initFirebase,
  getFirestore,
  isLiveFirestore,
  disableLiveFirestore,
};
