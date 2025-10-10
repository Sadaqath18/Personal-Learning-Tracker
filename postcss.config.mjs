const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

module.exports = {
  plugins: {
    tailwindcss: {},
    // Run after Tailwind so it transforms the generated CSS
    'postcss-preset-env': {
      stage: 3,
      features: {
        'color-mix': { preserve: false },
        'oklab-function': { preserve: false },
        'oklch-function': { preserve: false },
      },
    },
    autoprefixer: {},
  },
};