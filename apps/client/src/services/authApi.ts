import { API_ROUTES } from "@calcscope/shared";
import { apiClient } from "../lib/apiClient";
import type { AuthResponse, CurrentUserResponse, LoginInput, RegisterInput } from "../types/auth";

export const authApi = {
  register(input: RegisterInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse, RegisterInput>(API_ROUTES.auth.register, input);
  },

  login(input: LoginInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse, LoginInput>(API_ROUTES.auth.login, input);
  },

  getCurrentUser(token: string): Promise<CurrentUserResponse> {
    return apiClient.getWithToken<CurrentUserResponse>(API_ROUTES.auth.me, token);
  }
};
