// src/lib/firebaseAdmin.js

import admin from "firebase-admin";

// Check if the Firebase Admin SDK is already initialized to prevent errors
// in development or with serverless function restarts.
if (!admin.apps.length) {
  try {
    // Reconstruct the service account credentials object from environment variables.
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Handle newlines
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    };

    // Initialize the Admin SDK with the reconstructed credentials.
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase Admin SDK successfully initialized.");
  } catch (error) {
    console.error(
      "Firebase Admin SDK Initialization FAILED! Error:",
      error.message
    );
    // Vercel deployment will fail if these variables are missing.
    // The `if` check above prevents re-initialization on subsequent requests.
    if (!process.env.FIREBASE_PROJECT_ID) {
      console.error("Missing Firebase Admin SDK environment variables!");
    }
  }
}

// Export the initialized admin object for use in other files.
export { admin };
