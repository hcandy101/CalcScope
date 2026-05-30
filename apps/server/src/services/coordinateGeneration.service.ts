import type { EvalFunction } from "mathjs";
import type { GraphPoint, GraphRange } from "../types/graph.js";
import { evaluateEquationAtX, roundGraphCoordinate } from "./mathEvaluation.service.js";

export type GenerateCoordinatesInput = {
  compiled: EvalFunction;
  range: GraphRange;
};

export function generateCoordinates({ compiled, range }: GenerateCoordinatesInput): GraphPoint[] {
  const points: GraphPoint[] = [];
  const pointCount = Math.floor((range.maxX - range.minX) / range.step) + 1;

  for (let index = 0; index < pointCount; index += 1) {
    const x = roundGraphCoordinate(range.minX + index * range.step);
    const y = evaluateEquationAtX({ compiled, x });

    points.push({
      x,
      y,
      isValid: y !== null
    });
  }

  return points;
}
