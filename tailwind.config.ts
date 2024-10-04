import type { Config } from "tailwindcss";

const defaultTheme = require('tailwindcss/defaultTheme')

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'h-color': '#415F6B',
        'b-color': '#1b2e3c'
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    screens: {
      'xsm': {'max': '320px'},
      'xmd': {'max': '650px'},
      'nmd': {'min': '651px'},
      'xxsm': {'min': '300px'},
      ...defaultTheme.screens
    }
  },
  plugins: [],
};
export default config;
