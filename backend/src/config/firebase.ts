import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import serviceAccount from "../../firebase-service-account.json";

initializeApp({
  credential: cert(serviceAccount as any),
});

export const firebaseAuth = getAuth();
