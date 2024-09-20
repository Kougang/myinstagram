import { auth } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const dosignInWithEmailAndPassword = (email, passsword) => {
  return signInWithEmailAndPassword(auth, email, passsword);
};

export const dosignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result;
};

export const doSingOut = () => {
  return auth.signOut();
};

// 12min10
