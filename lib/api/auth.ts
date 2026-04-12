import { apiClient } from "./client";
import type {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  LogoutRequest,
  RefreshTokenRequest,
} from "@/lib/types/api";

export const authService = {
  async signup(data: SignupRequest) {
    return apiClient.post<AuthResponse>("/api/auth/signup", data);
  },

  async login(data: LoginRequest) {
    return apiClient.post<AuthResponse>("/api/auth/login", data);
  },

  async logout(options?: any) {
    return apiClient.post("/api/auth/logout", undefined, {
      token: options?.token,
    });
  },

  async refresh(data: RefreshTokenRequest) {
    return apiClient.post<AuthResponse>("/api/auth/refresh", data);
  },

  async getProfile(token: string) {
    return apiClient.get("/api/user/me", { token });
  },

  async updateProfile(token: string, body: any) {
    return apiClient.patch("/api/user/me", body, { token });
  },
};
