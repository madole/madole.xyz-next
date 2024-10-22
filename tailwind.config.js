module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        handwritten: ["Delius", "cursive"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        horizontalBounce: {
          "0%": { width: "10px" },
          "20%": { width: "200px" },
          "80%": { width: "200px" },
          "100%": { width: "10px" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
        slowFadeIn: "fadeIn 3s ease-in-out",
        horizontalBounce: "horizontalBounce 5s ease-in-out alternate infinite",
      },
      colors: {
        "trello-blue": "#0079BF",
        "trello-grey": "#EBECF0",
      },
    },
    maxHeight: {
      0: "0",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      "4/5": "80%",
      "9/10": "90%",
      "almost-full": "95%",
      full: "100%",
    },
    gridTemplateColumns: {
      // Simple 16 column grid
      16: "repeat(16, minmax(0, 1fr))",

      // Complex site-specific column configuration
      layout: "1fr minmax(100ch, 1fr) 1fr",
      mobile: "repeat(auto-fit, minmax(200px, auto))",
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
