import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        modalBackdrop: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        modalSlide: {
          "0%": { transform: "translateY(20px) scale(0.97)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        storyRing: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "slide-down": "slideDown 0.3s ease-out forwards",
        "modal-backdrop": "modalBackdrop 0.2s ease-out forwards",
        "modal-slide": "modalSlide 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "story-ring": "storyRing 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
