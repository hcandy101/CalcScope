import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { clearAuthToken, getAuthToken, saveAuthToken } from "../lib/authSession";
import { authApi } from "../services/authApi";
import type { AuthUser, LoginInput, RegisterInput } from "../types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  status: "checking" | "authenticated" | "anonymous";
  message: string;
  register(input: RegisterInput): Promise<void>;
  login(input: LoginInput): Promise<void>;
  logout(): void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("checking");
  const [message, setMessage] = useState("Not signed in");

  useEffect(() => {
    async function restoreSession() {
      const token = getAuthToken();

      if (!token) {
        setStatus("anonymous");
        return;
      }

      try {
        // localStorage proves only that the browser remembers a token.
        // /me proves that the backend still accepts it.
        const result = await authApi.getCurrentUser(token);
        setUser(result.user);
        setMessage(`Signed in as ${result.user.name || result.user.email}`);
        setStatus("authenticated");
      } catch {
        clearAuthToken();
        setMessage("Please log in again.");
        setStatus("anonymous");
      }
    }

    void restoreSession();
  }, []);

  const acceptAuthResult = useCallback((resultUser: AuthUser, token: string) => {
    saveAuthToken(token);
    setUser(resultUser);
    setMessage(`Signed in as ${resultUser.name || resultUser.email}`);
    setStatus("authenticated");
  }, []);

  const register = useCallback(
    async (input: RegisterInput) => {
      setMessage("Creating account...");
      const result = await authApi.register(input);
      acceptAuthResult(result.user, result.token);
    },
    [acceptAuthResult]
  );

  const login = useCallback(
    async (input: LoginInput) => {
      setMessage("Checking credentials...");
      const result = await authApi.login(input);
      acceptAuthResult(result.user, result.token);
    },
    [acceptAuthResult]
  );

  const logout = useCallback(() => {
    clearAuthToken();
    setUser(null);
    setMessage("Not signed in");
    setStatus("anonymous");
  }, []);

  const value = useMemo(
    () => ({ user, status, message, register, login, logout }),
    [user, status, message, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
