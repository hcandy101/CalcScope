// Vite only exposes browser-safe variables that start with VITE_.
// The default keeps first-time local development simple, while .env can override it.
const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

// Keep the first API helper small. More methods can be added as the app grows.
export const apiClient = {
  async get<TResponse>(path: string): Promise<TResponse> {
    const response = await fetch(`${apiBaseUrl}${path}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json() as Promise<TResponse>;
  }
};
