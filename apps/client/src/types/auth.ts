import type { AuthResponse, AuthUser, CurrentUserResponse } from "@calcscope/shared";

export type { AuthResponse, AuthUser, CurrentUserResponse };

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};
