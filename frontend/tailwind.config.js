/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      colors: {
        vark: {
          V: '#6366f1',
          A: '#10b981',
          R: '#f59e0b',
          K: '#ec4899',
        },
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(99, 102, 241, 0.25)',
      },
    },
  },
  plugins: [],
};
