import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { LoginPage } from "../pages/LoginPage";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();

  if (status === "checking") {
    return (
      <main className="grid min-h-screen place-items-center bg-surface px-6 py-10 text-ink">
        <p className="text-sm font-semibold text-slate-600">Checking your session...</p>
      </main>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
