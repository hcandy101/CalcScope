// Shared constants should be stable contracts both client and server understand.
// Avoid putting database code, React code, or Express code in this package.
export const API_ROUTES = {
  health: "/health",
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    me: "/auth/me"
  },
  graphs: {
    points: "/graphs/points"
  }
} as const;

export type ApiMessage = {
  message: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

export type CurrentUserResponse = {
  user: AuthUser;
};

export type GraphRange = {
  minX: number;
  maxX: number;
  step: number;
};

export type GenerateGraphPointsRequest = {
  expression: string;
  range: GraphRange;
};

export type GraphPoint = {
  x: number;
  y: number | null;
  isValid: boolean;
};

export type GenerateGraphPointsResponse = {
  expression: string;
  range: GraphRange;
  points: GraphPoint[];
};
