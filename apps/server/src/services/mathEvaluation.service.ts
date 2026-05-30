import type { EvalFunction } from "mathjs";

export type EvaluateEquationInput = {
  compiled: EvalFunction;
  x: number;
};

function roundCoordinate(value: number): number {
  return Number(value.toPrecision(12));
}

export function toGraphNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return roundCoordinate(value);
}

export function evaluateEquationAtX({ compiled, x }: EvaluateEquationInput): number | null {
  try {
    const result = compiled.evaluate({
      x,
      ln: Math.log
    });

    return toGraphNumber(result);
  } catch {
    return null;
  }
}

export function roundGraphCoordinate(value: number): number {
  return roundCoordinate(value);
}
