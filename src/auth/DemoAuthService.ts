import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthService, User, LoginCredentials, RegisterCredentials } from "./types";

const DEMO_USERS: User[] = [
  {
    uid: "demo-user-001",
    email: "demo@paypilot.com",
    displayName: "Demo User",
    photoURL: null,
  },
  {
    uid: "demo-user-002",
    email: "user@paypilot.com",
    displayName: "Test User",
    photoURL: null,
  },
];

const DEMO_PASSWORDS: Record<string, string> = {
  "demo@paypilot.com": "Demo@123",
  "user@paypilot.com": "User@123",
};

const STORAGE_KEY = "@paypilot_demo_session";

let currentUser: User | null = null;
let listeners: Array<(user: User | null) => void> = [];

function notifyListeners(user: User | null) {
  currentUser = user;
  listeners.forEach((cb) => cb(user));
}

async function persistSession(user: User | null) {
  if (user) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}

async function restoreSession() {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  if (json) {
    try {
      const user = JSON.parse(json) as User;
      currentUser = user;
      return user;
    } catch {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }
  return null;
}

export const demoAuthService: AuthService = {
  onAuthChanged: (callback) => {
    listeners.push(callback);
    callback(currentUser);
    return () => {
      listeners = listeners.filter((l) => l !== callback);
    };
  },

  login: async (credentials: LoginCredentials) => {
    const { email, password } = credentials;
    const normalizedEmail = email.toLowerCase().trim();
    const expectedPassword = DEMO_PASSWORDS[normalizedEmail];

    if (!expectedPassword) {
      throw new Error("No account found with this email address.");
    }
    if (password !== expectedPassword) {
      throw new Error("Invalid password. Please try again.");
    }

    const user = DEMO_USERS.find((u) => u.email === normalizedEmail);
    if (!user) throw new Error("Account not found.");

    await persistSession(user);
    notifyListeners(user);
    return user;
  },

  register: async (credentials: RegisterCredentials) => {
    const { email, displayName } = credentials;
    const normalizedEmail = email.toLowerCase().trim();

    if (DEMO_PASSWORDS[normalizedEmail]) {
      throw new Error("An account with this email already exists.");
    }

    const user: User = {
      uid: `demo-${Date.now()}`,
      email: normalizedEmail,
      displayName,
      photoURL: null,
    };

    DEMO_USERS.push(user);
    DEMO_PASSWORDS[normalizedEmail] = credentials.password;

    await persistSession(user);
    notifyListeners(user);
    return user;
  },

  logout: async () => {
    await persistSession(null);
    notifyListeners(null);
  },

  resetPassword: async (email: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    if (!DEMO_PASSWORDS[normalizedEmail]) {
      throw new Error("No account found with this email address.");
    }
  },

  getCurrentUser: () => currentUser,
};

restoreSession().then((user) => {
  if (user) notifyListeners(user);
});
