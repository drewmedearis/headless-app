import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cursor-inspired palette
        cursor: {
          black: "#000000",
          bg: "#0A0A0A",
          surface: "#111111",
          border: "#1F1F1F",
          "border-light": "#2A2A2A",
          muted: "#666666",
          text: "#E4E4E4",
          "text-secondary": "#888888",
          white: "#FFFFFF",
        },
        accent: {
          cyan: "#83D6C5",
          blue: "#87C3FF",
          orange: "#EFB080",
          magenta: "#E394DC",
          gold: "#EBC88D",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-mono)"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
