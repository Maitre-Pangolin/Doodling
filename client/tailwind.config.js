module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      transitionProperty: {
        width: ["width", "height"],
      },
    },
    fontFamily: {
      sans: ["Lato", "sans-serif"],
      header: ["Gloria Hallelujah"],
    },
  },
  plugins: [],
};
