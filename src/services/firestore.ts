import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  addDoc,
  onSnapshot,
  Unsubscribe,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";

const timestamps = () => ({
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

export const firestoreService = {
  get: async <T>(collectionName: string, docId: string): Promise<T | null> => {
    if (!db) return null;
    try {
      const snap = await getDoc(doc(db, collectionName, docId));
      return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
    } catch {
      return null;
    }
  },

  set: async (collectionName: string, docId: string, data: DocumentData) => {
    if (!db) return;
    await setDoc(doc(db, collectionName, docId), { ...data, ...timestamps() });
  },

  update: async (collectionName: string, docId: string, data: DocumentData) => {
    if (!db) return;
    await updateDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  delete: async (collectionName: string, docId: string) => {
    if (!db) return;
    await deleteDoc(doc(db, collectionName, docId));
  },

  list: async <T>(
    collectionName: string,
    constraints: QueryConstraint[] = [],
  ): Promise<T[]> => {
    if (!db) return [];
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
    } catch {
      return [];
    }
  },

  add: async (collectionName: string, data: DocumentData) => {
    if (!db) return "";
    const ref = await addDoc(collection(db, collectionName), {
      ...data,
      ...timestamps(),
    });
    return ref.id;
  },

  listByUser: <T>(collectionName: string, userId: string) =>
    firestoreService.list<T>(collectionName, [
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    ]),

  listByUserAndMonth: <T>(
    collectionName: string,
    userId: string,
    month: number,
    year: number,
  ) =>
    firestoreService.list<T>(collectionName, [
      where("userId", "==", userId),
      where("month", "==", month),
      where("year", "==", year),
    ]),

  subscribeToUser: <T>(
    collectionName: string,
    userId: string,
    callback: (items: T[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe | null => {
    if (!db) {
      callback([]);
      return null;
    }
    const q = query(
      collection(db, collectionName),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
        callback(items);
      },
      (error) => {
        if (onError) onError(error);
        else console.warn("Firestore subscription error:", error.message);
      },
    );
  },

  subscribeToDocument: <T>(
    collectionName: string,
    docId: string,
    callback: (item: T | null) => void,
  ): Unsubscribe | null => {
    if (!db) {
      callback(null);
      return null;
    }
    return onSnapshot(doc(db, collectionName, docId), (snap) => {
      callback(snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null);
    });
  },
};
