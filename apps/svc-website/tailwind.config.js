/**
 * Tailwind configuration for the public wedding website. The config keeps the
 * palette in sync with our design tokens so React components and raw markup can
 * share the same values.
 */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx,html}", "./pages/**/*.{ts,tsx,js,jsx,html}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      borderRadius: {
        "2xl": "1rem",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Noto Sans",
          "Liberation Sans",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
