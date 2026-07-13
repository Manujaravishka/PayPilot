export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role?: "admin" | "manager" | "employee";
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthService {
  onAuthChanged(callback: (user: User | null) => void): () => void;
  login(credentials: LoginCredentials): Promise<User>;
  register(credentials: RegisterCredentials): Promise<User>;
  logout(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  getCurrentUser(): User | null;
  /** @deprecated Not supported in Demo mode */
  loginWithGoogle?(idToken: string): Promise<User>;
}
