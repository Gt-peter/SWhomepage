// 213703/frontend/tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      container: { center: true, padding: "1rem" }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
