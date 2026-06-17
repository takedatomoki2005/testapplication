import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F0276B",
          dark: "#E0156B",
          light: "#FF6BAA",
          tint: "rgba(240, 39, 107, 0.15)"
        },
        accent: "#FFD600",
        surface: "#FFFFFF",
        bg: "#F5F5F7",
        ink: "#1A1A1A",
        sub: "#888888",
        line: "#F0F0F0"
      },
      fontFamily: {
        sans: [
          "Hiragino Sans",
          "Noto Sans JP",
          "system-ui",
          "-apple-system",
          "sans-serif"
        ]
      },
      borderRadius: {
        card: "16px",
        badge: "12px",
        pill: "999px"
      },
      boxShadow: {
        card: "0 2px 10px rgba(0,0,0,0.06)",
        shell: "0 12px 40px rgba(0,0,0,0.14)"
      }
    }
  },
  plugins: []
};

export default config;
