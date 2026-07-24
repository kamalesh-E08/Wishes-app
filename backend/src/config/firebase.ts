import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let serviceAccount: any;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = require("../../firebase-service-account.json");
}

initializeApp({
  credential: cert(serviceAccount),
});

export const firebaseAuth = getAuth();
