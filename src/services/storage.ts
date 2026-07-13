import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  UploadResult,
} from "firebase/storage";
import { storage } from "./firebase";

export const storageService = {
  upload: async (path: string, blob: Blob | Uint8Array | ArrayBuffer): Promise<string> => {
    if (!storage) throw new Error("Storage not initialized");
    const storageRef = ref(storage, path);
    const result: UploadResult = await uploadBytes(storageRef, blob);
    return await getDownloadURL(result.ref);
  },

  uploadReceipt: async (userId: string, expenseId: string, blob: Blob | Uint8Array | ArrayBuffer) => {
    return storageService.upload(`receipts/${userId}/${expenseId}.jpg`, blob);
  },

  delete: async (path: string) => {
    if (!storage) return;
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },

  getUrl: async (path: string): Promise<string> => {
    if (!storage) throw new Error("Storage not initialized");
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  },
};