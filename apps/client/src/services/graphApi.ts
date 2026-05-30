import { API_ROUTES } from "@calcscope/shared";
import { apiClient } from "../lib/apiClient";
import type { GenerateGraphPointsRequest, GenerateGraphPointsResponse } from "@calcscope/shared";

export const graphApi = {
  generatePoints(
    input: GenerateGraphPointsRequest,
    token: string
  ): Promise<GenerateGraphPointsResponse> {
    return apiClient.postWithToken<GenerateGraphPointsResponse, GenerateGraphPointsRequest>(
      API_ROUTES.graphs.points,
      input,
      token
    );
  }
};
