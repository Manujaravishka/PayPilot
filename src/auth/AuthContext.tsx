import React, { createContext, useEffect, useState, useCallback, useRef } from "react";
import type { User, LoginCredentials, RegisterCredentials } from "./types";
import { authConfig } from "./config";
import { firebaseAuthService } from "./FirebaseAuthService";
import { demoAuthService } from "./DemoAuthService";

function getService() {
  if (authConfig.isDemoMode) return demoAuthService;
  return firebaseAuthService;
}

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const serviceRef = useRef(getService());

  useEffect(() => {
    const service = serviceRef.current;
    const unsub = service.onAuthChanged((u) => {
      setUser(u);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const service = serviceRef.current;
    const u = await service.login(credentials);
    return u;
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const service = serviceRef.current;
    const u = await service.register(credentials);
    return u;
  }, []);

  const logout = useCallback(async () => {
    const service = serviceRef.current;
    await service.logout();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const service = serviceRef.current;
    await service.resetPassword(email);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        isDemoMode: authConfig.isDemoMode,
        login,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
