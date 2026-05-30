import type { GenerateGraphPointsRequest, GenerateGraphPointsResponse, GraphRange } from "../types/graph.js";
import {
  EquationValidationError,
  validateEquationExpression
} from "../utils/equationValidation.js";
import { generateCoordinates } from "./coordinateGeneration.service.js";

const MAX_POINTS = 5000;

export class GraphError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400
  ) {
    super(message);
  }
}

function assertFiniteNumber(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new GraphError(`${fieldName} must be a finite number.`);
  }

  return value;
}

function validateRange(input: unknown): GraphRange {
  if (typeof input !== "object" || input === null) {
    throw new GraphError("Range is required.");
  }

  const range = input as Partial<GraphRange>;
  const minX = assertFiniteNumber(range.minX, "range.minX");
  const maxX = assertFiniteNumber(range.maxX, "range.maxX");
  const step = assertFiniteNumber(range.step, "range.step");

  if (minX >= maxX) {
    throw new GraphError("range.minX must be less than range.maxX.");
  }

  if (step <= 0) {
    throw new GraphError("range.step must be greater than 0.");
  }

  const estimatedPointCount = Math.floor((maxX - minX) / step) + 1;

  if (estimatedPointCount > MAX_POINTS) {
    throw new GraphError(
      `Range and step would create ${estimatedPointCount} points. Use ${MAX_POINTS} or fewer.`
    );
  }

  return { minX, maxX, step };
}

export function generateGraphPoints(
  input: GenerateGraphPointsRequest
): GenerateGraphPointsResponse {
  let validatedEquation;

  try {
    validatedEquation = validateEquationExpression(input.expression);
  } catch (error) {
    if (error instanceof EquationValidationError) {
      throw new GraphError(error.message);
    }

    throw error;
  }

  const range = validateRange(input.range);
  const points = generateCoordinates({
    compiled: validatedEquation.compiled,
    range
  });

  return {
    expression: validatedEquation.expression,
    range,
    points
  };
}
