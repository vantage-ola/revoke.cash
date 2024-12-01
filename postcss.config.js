// perhaps its my pc misbehaving.
// on production build, generated css at ./next/static/css/.../xxxx should not be 68kb...alot of unused css
// tailwind  is not properly purging content: [] or postcss is not doing its job, something is wrong along the line.
// i doubt its dynamic css, coz the classnames are not unique... even the tw merge doesnt new create new names tailwind wont catch

// impact of fix.. i think it would improve the fcp slightly, considering its decent on both mobile and pc.
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    './lib/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './content/**/*.{md,mdx}',
  ],
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { purgecss } : {}), // only on production, 'development' for development
  },
};
