export default {
  plugins: {
    "@tailwindcss/postcss": {},
      // keep minimal config; let preset-env add widely supported fallbacks
      // uncomment if you specifically want to remove modern color syntax
      // features: {
      // "color-mix": { preserve: false }
      // }
    autoprefixer: {},
  },
};
