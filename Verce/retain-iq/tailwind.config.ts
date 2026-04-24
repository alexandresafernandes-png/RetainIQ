import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0faf4",
          100: "#d9f2e3",
          200: "#b3e5c7",
          300: "#7dcfa4",
          400: "#4ab37d",
          500: "#2a9960",
          600: "#1d7a4b",
          700: "#17603b",
          800: "#144d30",
          900: "#113f28",
        },
        surface: {
          0:   "#ffffff",
          50:  "#f8f9fa",
          100: "#f1f3f5",
          200: "#e9ecef",
          300: "#dee2e6",
        },
        ink: {
          900: "#111827",
          700: "#374151",
          500: "#6b7280",
          300: "#d1d5db",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
