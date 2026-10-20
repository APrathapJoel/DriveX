import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let firestoreInstance = null;
let isLive = false;

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

  // 1. Check for Service Account JSON file
  for (const filePath of possibleServiceAccountPaths) {
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const serviceAccount = JSON.parse(fileContent);
        
        if (!getApps().length) {
          initializeApp({
            credential: cert(serviceAccount),
          });
        }
        firestoreInstance = getAdminFirestore();
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
      if (!getApps().length) {
        initializeApp({
          credential: cert({
            projectId: config.firebase.projectId,
            clientEmail: config.firebase.clientEmail,
            privateKey: config.firebase.privateKey,
          }),
        });
      }
      firestoreInstance = getAdminFirestore();
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
      if (!getApps().length) {
        initializeApp({
          projectId: config.firebase.projectId || 'drivex-local',
        });
      }
      firestoreInstance = getAdminFirestore();
      isLive = true;
      console.log(`\n🔥 [Firebase] Connected to Firestore Emulator at ${process.env.FIRESTORE_EMULATOR_HOST}\n`);
      return { db: firestoreInstance, isLive };
    } catch (err) {
      console.warn(`[Firebase] Failed to connect to emulator: ${err.message}`);
    }
  }

  // 4. Fallback local store (persists to backend/data/firestore_data.json)
  console.log(`\n========================================================================`);
  console.log(`🔥 [Firebase Notice] No Google Cloud Firebase credentials detected.`);
  console.log(`   Running with local file-backed Firestore simulation (zero crash).`);
  console.log(`   👉 To connect your live Firebase project:`);
  console.log(`      1. Download your service account key from Firebase Console`);
  console.log(`         (Project Settings > Service Accounts > Generate new private key)`);
  console.log(`      2. Save it as 'backend/serviceAccountKey.json'`);
  console.log(`      3. Or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env`);
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
