import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { GenerateGraphPointsResponse, GraphRange } from "@calcscope/shared";
import { getAuthToken } from "../lib/authSession";
import { graphApi } from "../services/graphApi";

const defaultRange: GraphRange = {
  minX: -10,
  maxX: 10,
  step: 1
};

function formatYValue(value: number | null): string {
  return value === null ? "undefined" : String(value);
}

export function EquationInput() {
  const [expression, setExpression] = useState("x^2");
  const [range, setRange] = useState<GraphRange>(defaultRange);
  const [result, setResult] = useState<GenerateGraphPointsResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validPointCount = useMemo(() => {
    return result?.points.filter((point) => point.isValid).length ?? 0;
  }, [result]);

  function updateRange(field: keyof GraphRange, value: string) {
    setRange((currentRange) => ({
      ...currentRange,
      [field]: Number(value)
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getAuthToken();

    if (!token) {
      setError("Please log in again before generating graph points.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const nextResult = await graphApi.generatePoints(
        {
          expression,
          range
        },
        token
      );

      setResult(nextResult);
    } catch (caughtError) {
      setResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "Could not generate points.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900">Equation Engine</h2>
        <p className="text-sm text-slate-600">
          Generate graph-ready coordinates without rendering a graph yet.
        </p>
      </div>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Equation</span>
          <input
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="x^2, 3*x + 5, sin(x)"
            type="text"
            value={expression}
            onChange={(event) => setExpression(event.target.value)}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Min x</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              type="number"
              value={range.minX}
              onChange={(event) => updateRange("minX", event.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Max x</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              type="number"
              value={range.maxX}
              onChange={(event) => updateRange("maxX", event.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Step</span>
            <input
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              min="0.01"
              step="0.01"
              type="number"
              value={range.step}
              onChange={(event) => updateRange("step", event.target.value)}
            />
          </label>
        </div>

        <button
          className="rounded-md bg-accent px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Generating..." : "Generate Coordinates"}
        </button>
      </form>

      {error ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold text-slate-800">
              {result.points.length} points generated, {validPointCount} valid
            </p>
            <p className="font-mono text-sm text-slate-600">y = {result.expression}</p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-80 border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-2 pr-4 font-semibold">x</th>
                  <th className="py-2 pr-4 font-semibold">y</th>
                  <th className="py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {result.points.slice(0, 8).map((point) => (
                  <tr className="border-b border-slate-200 last:border-0" key={point.x}>
                    <td className="py-2 pr-4 font-mono">{point.x}</td>
                    <td className="py-2 pr-4 font-mono">{formatYValue(point.y)}</td>
                    <td className="py-2 text-slate-600">
                      {point.isValid ? "ready" : "skipped"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}
