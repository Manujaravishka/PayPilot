import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useAuthStore } from "../features/auth/store/authStore";

export function AuthBridge({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  return <>{children}</>;
}
