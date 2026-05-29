import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

function AppRoutes() {
  const path = window.location.pathname;
  const { user } = useAuth();

  if (path === "/register" && !user) {
    return <RegisterPage />;
  }

  if (path === "/login" && !user) {
    return <LoginPage />;
  }

  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
