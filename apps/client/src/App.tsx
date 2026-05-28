import { FormEvent, useEffect, useState } from "react";
import { API_ROUTES } from "@calcscope/shared";
import { clearAuthToken, getAuthToken, saveAuthToken } from "./lib/authSession";
import { apiClient } from "./lib/apiClient";

type AuthMode = "login" | "register";

type AuthResponse = {
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
  };
  token: string;
};

type CurrentUserResponse = {
  user: AuthResponse["user"];
};

const calculusOptions = ["Derivative", "Integral", "Limit"];

export function App() {
  const [activePage, setActivePage] = useState("Graph");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authMessage, setAuthMessage] = useState("Not signed in");
  const [currentUser, setCurrentUser] = useState<AuthResponse["user"] | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [apiMessage, setApiMessage] = useState("API not checked yet");
  const [expression, setExpression] = useState("x^2");
  const [selectedOption, setSelectedOption] = useState("Derivative");

  useEffect(() => {
    async function restoreSession() {
      const token = getAuthToken();

      if (!token) {
        setIsCheckingSession(false);
        return;
      }

      try {
        const result = await apiClient.getWithToken<CurrentUserResponse>(API_ROUTES.auth.me, token);
        setCurrentUser(result.user);
        setAuthMessage(`Signed in as ${result.user.name || result.user.email}`);
      } catch {
        clearAuthToken();
        setAuthMessage("Please log in again.");
      } finally {
        setIsCheckingSession(false);
      }
    }

    void restoreSession();
  }, []);

  async function checkApiHealth() {
    try {
      const health = await apiClient.get<{ status: string }>(API_ROUTES.health);
      setApiMessage(`API status: ${health.status}`);
    } catch {
      setApiMessage("Could not reach the API");
    }
  }

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingAuth(true);
    setAuthMessage(authMode === "login" ? "Checking credentials..." : "Creating account...");

    try {
      const route = authMode === "login" ? API_ROUTES.auth.login : API_ROUTES.auth.register;
      const result = await apiClient.post<AuthResponse, Record<string, unknown>>(route, {
        email,
        password,
        ...(authMode === "register" ? { name } : {})
      });

      saveAuthToken(result.token);
      setAuthMessage(`Signed in as ${result.user.name || result.user.email}`);
      setCurrentUser(result.user);
      setActivePage("Graph");
      setPassword("");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsSubmittingAuth(false);
    }
  }

  function signOut() {
    clearAuthToken();
    setCurrentUser(null);
    setActivePage("Graph");
    setAuthMessage("Not signed in");
  }

  if (isCheckingSession) {
    return (
      <main className="grid min-h-screen place-items-center bg-surface px-6 py-10 text-ink">
        <p className="text-sm font-semibold text-slate-600">Checking your session...</p>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-surface px-6 py-10 text-ink">
        <section className="mx-auto max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-center">
            <p className="text-3xl font-bold">CalcScope</p>
            <p className="mt-2 text-slate-600">Login or register before opening the graph workspace.</p>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold ${
                authMode === "login" ? "bg-accent text-white" : "border border-slate-300"
              }`}
              type="button"
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold ${
                authMode === "register" ? "bg-accent text-white" : "border border-slate-300"
              }`}
              type="button"
              onClick={() => setAuthMode("register")}
            >
              Register
            </button>
          </div>

          <form className="mt-5 space-y-3" onSubmit={handleAuthSubmit}>
            {authMode === "register" ? (
              <label className="block text-sm font-semibold text-slate-700">
                Name
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-accent"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
            ) : null}

            <label className="block text-sm font-semibold text-slate-700">
              Email
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-accent"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Password
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-accent"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            <button
              className="w-full rounded-md bg-accent px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
              type="submit"
              disabled={isSubmittingAuth}
            >
              {isSubmittingAuth ? "Please wait..." : authMode === "login" ? "Login" : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600">{authMessage}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface text-ink">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-2xl font-bold">CalcScope</p>
            <p className="text-sm text-slate-600">
              Signed in as {currentUser.name || currentUser.email}
            </p>
          </div>

          <nav className="flex gap-2" aria-label="Main navigation">
            {["Graph", "Settings"].map((page) => (
              <button
                className={`rounded-md px-3 py-2 text-sm font-semibold ${
                  activePage === page
                    ? "bg-accent text-white"
                    : "border border-slate-300 bg-white text-slate-700"
                }`}
                key={page}
                type="button"
                onClick={() => setActivePage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
              type="button"
              onClick={signOut}
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold">{activePage}</h1>

          {activePage === "Graph" ? (
            <div className="mt-5 space-y-5">
              <label className="block text-sm font-semibold text-slate-700">
                Function
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-mono outline-none focus:border-accent"
                  value={expression}
                  onChange={(event) => setExpression(event.target.value)}
                />
              </label>

              <div>
                <p className="text-sm font-semibold text-slate-700">Calculus option</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {calculusOptions.map((option) => (
                    <button
                      className={`rounded-md px-3 py-2 text-sm font-semibold ${
                        selectedOption === option
                          ? "bg-accent text-white"
                          : "border border-slate-300 text-slate-700"
                      }`}
                      key={option}
                      type="button"
                      onClick={() => setSelectedOption(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-600">Graph preview</p>
                <div className="mt-4 grid h-56 place-items-center rounded-md border border-dashed border-slate-300 bg-white">
                  <p className="text-center text-slate-500">
                    Graph for <span className="font-mono text-ink">{expression}</span> will go here.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {activePage === "Settings" ? (
            <div className="mt-5 space-y-3">
              <p className="text-slate-600">{apiMessage}</p>
              <button
                className="rounded-md bg-accent px-4 py-2 font-semibold text-white"
                type="button"
                onClick={checkApiHealth}
              >
                Check API Health
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
