import { useState, useCallback, useEffect } from "react";
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
} from "@/lib/types/api";

export interface UseAuthResult {
  user: AuthResponse | null;
  token: string | null;
  loading: boolean;
  error: any | null;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

/**
 * Custom hook for authentication management
 *
 * @example
 * const { user, token, loading, login, signup, logout, isAuthenticated } = useAuth();
 *
 * // Check if user is authenticated
 * if (!isAuthenticated) {
 *   return <LoginPage />;
 * }
 *
 * // Login
 * const handleLogin = async () => {
 *   await login({ email: "user@example.com", password: "password" });
 * };
 */
export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse saved user:", err);
      }
    }

    setLoading(false);
  }, []);

  const saveAuth = useCallback((authData: AuthResponse) => {
    setUser(authData);
    setToken(authData.token);
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData));
    setError(null);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(credentials),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Login failed");
        }

        saveAuth(result.data);
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [saveAuth],
  );

  const signup = useCallback(
    async (data: SignupRequest) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Signup failed");
        }

        saveAuth(result.data);
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [saveAuth],
  );

  const logout = useCallback(async () => {
    try {
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearAuth();
    }
  }, [token, clearAuth]);

  return {
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!token && !!user,
  };
}
