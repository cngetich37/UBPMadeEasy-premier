/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      primary: "#FBCC1A",

      secondary: "#065A38",

      accent: "#007200",

      neutral: "#0d1311",

      "base-100": "#1e2a24",

      info: "#00caff",

      success: "#065A38",

      warning: "#f94e00",

      error: "#e00037",
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#065A38", // Change step-primary color
          "secondary": "#FBCC1A",
          "accent": "#757575",
          // Other colors...
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
