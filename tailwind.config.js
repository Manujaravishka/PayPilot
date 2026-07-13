/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00A651",
          light: "#34C759",
          dark: "#008F45",
        },
        secondary: {
          DEFAULT: "#5856D6",
          light: "#7C7CFF",
          dark: "#4A4AC4",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#06B6D4",
        background: {
          light: "#F8FAFC",
          dark: "#0F172A",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1E293B",
        },
        "text-primary": {
          light: "#0F172A",
          dark: "#F8FAFC",
        },
        "text-secondary": {
          light: "#64748B",
          dark: "#94A3B8",
        },
        border: {
          light: "#E2E8F0",
          dark: "#334155",
        },
      },
      fontFamily: {
        sans: ["Inter_400Regular"],
        "inter-regular": ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-semibold": ["Inter_600SemiBold"],
        "inter-bold": ["Inter_700Bold"],
        "inter-extrabold": ["Inter_800ExtraBold"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
    },
  },
  plugins: [],
};
