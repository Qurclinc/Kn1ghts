/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        neon: "#39ff14"
      },
      boxShadow: {
        neon: "0 0 12px rgba(57,255,20,0.6)",
        neonStrong: "0 0 40px rgba(57,255,20,0.6)"
      },
      dropShadow: {
        glow: "0 0 10px rgba(57,255,20,0.9)"
      },
    }
  },
  plugins: [],
}

