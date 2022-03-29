module.exports = {
  mode: 'jit',
  important: true,
  prefix: 'tw-',
  content: [
    './src/**/*.{html,ts}',
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
    screens: {
      '2xl-max': { 'max': '1535px' },

      'xl-max': { 'max': '1279px' },

      'lg-max': { 'max': '1023px' },

      'md-max': { 'max': '767px' },

      'sm-max': { 'max': '639px' },

      '2xl-min': { 'min': '1536px' },

      'xl-min': { 'min': '1280px' },

      'lg-min': { 'min': '1024px' },

      'md-min': { 'min': '768px' },

      'sm-min': { 'min': '640px' },
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}