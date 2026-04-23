/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Strict black & white palette per PRD
        primary: '#000000',      // Black
        secondary: '#FFFFFF',    // White
        accent: '#1a1a1a',       // Near-black for depth
        muted: '#666666',        // Dark gray
        subtle: '#e0e0e0',       // Light gray
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
