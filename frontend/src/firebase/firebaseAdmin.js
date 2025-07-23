import * as admin from "firebase-admin";

console.log("Firebase Admin SDK: Attempting initialization...");

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
    console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
    console.log(
      "FIREBASE_PRIVATE_KEY loaded:",
      privateKey ? "YES (length: " + privateKey.length + ")" : "NO"
    );
    // console.log('FIREBASE_PRIVATE_KEY content (first 50 chars):', privateKey ? privateKey.substring(0, 50) : 'N/A'); // Be careful not to log the whole key in production

    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !privateKey
    ) {
      throw new Error("Missing Firebase Admin SDK environment variables!");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey.replace(/\\n/g, "\n"), // Handle newline characters
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    console.log("Firebase Admin SDK: Successfully initialized.");
  } catch (error) {
    console.error("Firebase Admin SDK: Initialization FAILED!", error);
    // You might want to throw the error or handle it gracefully
  }
} else {
  console.log("Firebase Admin SDK: Already initialized.");
}

export { admin };
