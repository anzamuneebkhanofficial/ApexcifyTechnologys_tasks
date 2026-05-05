import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

let firebaseApp = null;

try {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
    console.log("Firebase Admin initialized successfully.");
  } else {
    console.warn("FIREBASE_PRIVATE_KEY is missing.");
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error.message);
}

export default admin;
