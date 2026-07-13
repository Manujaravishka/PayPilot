import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import type { AuthService, User, LoginCredentials, RegisterCredentials } from "./types";

const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email ?? "",
  displayName: firebaseUser.displayName ?? "User",
  photoURL: firebaseUser.photoURL,
});

export const firebaseAuthService: AuthService = {
  onAuthChanged: (callback) => {
    if (!auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, (firebaseUser) => {
      callback(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
    });
  },

  login: async (credentials: LoginCredentials) => {
    if (!auth) throw new Error("Firebase not initialized");
    const { email, password } = credentials;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUser(userCredential.user);
  },

  register: async (credentials: RegisterCredentials) => {
    if (!auth || !db) throw new Error("Firebase not initialized");
    const { email, password, displayName } = credentials;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    await setDoc(doc(db, "users", userCredential.user.uid), {
      displayName,
      email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return mapFirebaseUser(userCredential.user);
  },

  loginWithGoogle: async (idToken: string) => {
    if (!auth || !db) throw new Error("Firebase not initialized");
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", userCredential.user.uid), {
        displayName: userCredential.user.displayName,
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return mapFirebaseUser(userCredential.user);
  },

  logout: async () => {
    if (!auth) return;
    await signOut(auth);
  },

  resetPassword: async (email: string) => {
    if (!auth) throw new Error("Firebase not initialized");
    await sendPasswordResetEmail(auth, email);
  },

  getCurrentUser: () => {
    if (!auth) return null;
    const firebaseUser = auth.currentUser;
    return firebaseUser ? mapFirebaseUser(firebaseUser) : null;
  },
};
