import { API_ROUTES } from "@calcscope/shared";
import { apiClient } from "./lib/apiClient";

export function App() {
  async function checkApiHealth() {
    const health = await apiClient.get(API_ROUTES.health);
    console.log("API health:", health);
  }

  return (
    <main className="min-h-screen bg-surface text-ink">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">CalcScope</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          A clean foundation for interactive calculus graphing.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          This starter wires together React, TypeScript, Vite, TailwindCSS, Express,
          PostgreSQL configuration, and authentication placeholders without building
          the graphing or calculus features yet.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="rounded-md bg-accent px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-teal-800"
            type="button"
            onClick={checkApiHealth}
          >
            Check API Health
          </button>
          <a
            className="rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:border-accent hover:text-accent"
            href="https://vitejs.dev/"
            rel="noreferrer"
            target="_blank"
          >
            Vite Docs
          </a>
        </div>
      </section>
    </main>
  );
}
