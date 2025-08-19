// frontend/tailwind.config.js
import forms from "@tailwindcss/forms";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        accent: {
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
        },
      },
      boxShadow: {
        glow: "0 10px 30px rgba(79,70,229,.25)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(600px 250px at 75% -50%, rgba(79,70,229,.35), transparent 60%), radial-gradient(800px 300px at -10% 10%, rgba(236,72,153,.20), transparent 60%)",
      },
    },
  },
  plugins: [forms],
};
