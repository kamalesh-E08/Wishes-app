import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";

import { app } from "../firebase/firebase";

const auth = getAuth(app);

export { auth };

export async function registerUser(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  await sendEmailVerification(credential.user);

  return credential.user;
}

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  return credential.user;
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);

  return result.user;
}
