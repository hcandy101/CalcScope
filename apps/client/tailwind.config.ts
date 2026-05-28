import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16202a",
        surface: "#f7f9fb",
        accent: "#0f766e"
      }
    }
  },
  plugins: []
} satisfies Config;
