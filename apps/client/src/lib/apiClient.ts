// Vite only exposes browser-safe variables that start with VITE_.
// The default keeps first-time local development simple, while .env can override it.
const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

function getErrorMessage(data: unknown): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return "API request failed.";
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);
}

async function request<TResponse>(
  path: string,
  options: RequestInit = {}
): Promise<TResponse> {
  const response = await fetch(`${apiBaseUrl}${path}`, options);
  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data as TResponse;
}

// Keep the first API helper small. More methods can be added as the app grows.
export const apiClient = {
  async get<TResponse>(path: string): Promise<TResponse> {
    return request<TResponse>(path);
  },

  async post<TResponse, TBody extends Record<string, unknown>>(
    path: string,
    body: TBody
  ): Promise<TResponse> {
    return request<TResponse>(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
  },

  async getWithToken<TResponse>(path: string, token: string): Promise<TResponse> {
    return request<TResponse>(path, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};
