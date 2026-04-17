import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        card: "var(--color-bg-card)",
        border: "var(--color-border)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },
        sun: {
          DEFAULT: "#F5A623",
          deep: "#E8960F",
          light: "#FDF0D5",
        },
        forest: {
          DEFAULT: "#3A8C2F",
          deep: "#2D6E24",
          light: "#E8F5E4",
        },
        leaf: {
          DEFAULT: "#7DC832",
          light: "#F2F8EE",
        },
        charcoal: {
          DEFAULT: "#4A4A4A",
          muted: "#9BA696",
        },
        excellent: "#3A8C2F",
        good: "#7DC832",
        fair: "#F5A623",
        danger: "#C0392B",
      },
      fontFamily: {
        serif: ["var(--font-barlow)", "Impact", "sans-serif"],
        sans: ["var(--font-roboto)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 24px 60px rgba(58, 140, 47, 0.12)",
        sun: "0 20px 45px rgba(245, 166, 35, 0.18)",
      },
      backgroundImage: {
        "island-grid":
          "radial-gradient(circle at top, rgba(245,166,35,0.12), transparent 34%), linear-gradient(135deg, rgba(125,200,50,0.07), transparent 55%)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
