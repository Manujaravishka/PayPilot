export type AuthMode = "firebase" | "demo";

function getFirebaseConfig() {
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
  if (apiKey && projectId) return { apiKey, projectId };
  return null;
}

export const authConfig = {
  get mode(): AuthMode {
    const envMode = process.env.EXPO_PUBLIC_AUTH_MODE;
    if (envMode === "firebase" || envMode === "demo") return envMode;
    return getFirebaseConfig() ? "firebase" : "demo";
  },
  get isFirebaseConfigured(): boolean {
    return getFirebaseConfig() !== null;
  },
  get isDemoMode(): boolean {
    return this.mode === "demo" || !this.isFirebaseConfigured;
  },
};
