import { API_ROUTES } from "@calcscope/shared";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../lib/apiClient";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [apiMessage, setApiMessage] = useState("API not checked yet");

  async function checkApiHealth() {
    try {
      const health = await apiClient.get<{ status: string }>(API_ROUTES.health);
      setApiMessage(`API status: ${health.status}`);
    } catch {
      setApiMessage("Could not reach the API");
    }
  }

  return (
    <main className="min-h-screen bg-surface text-ink">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-2xl font-bold">CalcScope</p>
            <p className="text-sm text-slate-600">Signed in as {user?.name || user?.email}</p>
          </div>

          <nav className="flex gap-2" aria-label="Main navigation">
            <a
              className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white"
              href="/"
            >
              Workspace
            </a>
            <button
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
              type="button"
              onClick={logout}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold">Workspace</h1>

          <div className="mt-5 space-y-5">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-600">Workspace</p>
              <div className="mt-4 grid h-56 place-items-center rounded-md border border-dashed border-slate-300 bg-white">
                <p className="text-center text-slate-500">Signed-in session is active.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-md border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-slate-600">{apiMessage}</p>
              <button
                className="rounded-md bg-accent px-4 py-2 font-semibold text-white"
                type="button"
                onClick={checkApiHealth}
              >
                Check API Health
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
