/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
          offblack: "#2E4045",
          cream: "#F9F0EC",
          red: "#D45B53",
          blue: "#8B9CB6",
          lgreen: "#738E88",
          dgreen: "#5B7365"
      },
      fontFamily: {
        mono: ['var(--font-montserrat)']
      }
    },
  },
  plugins: [],
});
