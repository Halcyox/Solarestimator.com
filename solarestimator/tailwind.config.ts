import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme'; // Import default theme

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans], // Set Poppins as default sans
        heading: ['Lexend', ...defaultTheme.fontFamily.sans], // Add Lexend for headings
      },
      colors: {
        // Example: Use CSS variables defined in globals.css
        // primary: 'var(--color-primary)',
        // secondary: 'var(--color-secondary)',
        // accent: 'var(--color-accent)',
        // You can also define specific shades directly
        // solar: {
        //   yellow: '#F9A825',
        //   blue: '#0288D1'
        // },
      },
      // Optional: Define custom text sizes for better hierarchy control
      // fontSize: {
      //   'xs': '0.75rem', 
      //   'sm': '0.875rem',
      //   'base': '1rem',
      //   'lg': '1.125rem',
      //   'xl': '1.25rem',
      //   '2xl': '1.5rem',
      //   '3xl': '1.875rem',
      //   '4xl': '2.25rem',
      //   '5xl': '3rem', // Example large heading
      //   '6xl': '3.75rem', // Example larger heading
      // }
    },
  },
  plugins: [],
};

export default config;
