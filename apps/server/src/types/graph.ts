export type GraphRange = {
  minX: number;
  maxX: number;
  step: number;
};

export type GenerateGraphPointsRequest = {
  expression: string;
  range: GraphRange;
};

export type GraphPoint = {
  x: number;
  y: number | null;
  isValid: boolean;
};

export type GenerateGraphPointsResponse = {
  expression: string;
  range: GraphRange;
  points: GraphPoint[];
};
