import { heroui } from '@heroui/react'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: ['class', '[data-theme="dark"]'],
  plugins: [heroui()],
}

export default config
