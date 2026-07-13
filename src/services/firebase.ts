import { Platform } from "react-native";
import { initializeApp, FirebaseApp, getApps } from "firebase/app";
import {
  getAuth,
  Auth,
  initializeAuth,
  // @ts-expect-error - getReactNativePersistence available in RN via Metro resolution
  getReactNativePersistence,
} from "firebase/auth";
import {
  getFirestore,
  Firestore,
  enableMultiTabIndexedDbPersistence,
  enableNetwork,
  disableNetwork,
} from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHnoEBZwuQTGEapF-1LgFBHLeDVbLgtt4",
  authDomain: "paypilot-a8801.firebaseapp.com",
  projectId: "paypilot-a8801",
  storageBucket: "paypilot-a8801.firebasestorage.app",
  messagingSenderId: "987517138749",
  appId: "1:987517138749:web:29a7d3c5b0691329047754",
  measurementId: "G-LGRCJY77KM",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let persistenceEnabled = false;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  if (Platform.OS === "web") {
    auth = getAuth(app);
  } else {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }

  db = getFirestore(app);
  storage = getStorage(app);

  if (Platform.OS === "web" && !persistenceEnabled) {
    enableMultiTabIndexedDbPersistence(db).catch((err) => {
      if (err.code === "failed-precondition") {
        console.warn("Multiple tabs open, persistence enabled in one tab only");
      } else if (err.code === "unimplemented") {
        console.warn("Browser doesn't support persistence");
      }
    });
    persistenceEnabled = true;
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { app, auth, db, storage };

export async function toggleNetwork(online: boolean) {
  if (!db) return;
  try {
    if (online) {
      await enableNetwork(db);
    } else {
      await disableNetwork(db);
    }
  } catch (err) {
    console.warn("Network toggle failed:", err);
  }
}
