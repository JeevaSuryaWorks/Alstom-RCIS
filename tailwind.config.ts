import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0F172A',
        panel: '#1E3A5A',
        accent: '#0EA5E9'
      }
    }
  },
  plugins: []
};

export default config;
