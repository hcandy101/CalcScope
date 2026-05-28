// Shared constants should be stable contracts both client and server understand.
// Avoid putting database code, React code, or Express code in this package.
export const API_ROUTES = {
  health: "/health",
  auth: {
    register: "/auth/register",
    login: "/auth/login"
  }
} as const;

export type ApiMessage = {
  message: string;
};
