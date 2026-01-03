/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blackish: "var(--color-black)",
        golden: "var(--color-golden)",
        greyish: "var(--color-grey)",
        whiteish: "var(--color-white)",
      },
      fontFamily: {
        base: "var(--font-base)",
        opensans: "var(--font-alt)", // only if you have this var, otherwise remove
      },
      keyframes: {
        "slide-bottom": {
          "0%": { transform: "translateY(-25%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-bottom": "slide-bottom 0.4s ease both",
      },
    },
  },
  plugins: [],
};
