/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
    theme: {
    extend: {
      colors: {
        'smoke-900': 'rgba(0, 0, 0, 0.9)',
        'smoke-800': 'rgba(0, 0, 0, 0.75)',
        'smoke-600': 'rgba(0, 0, 0, 0.6)',
        'smoke': 'rgba(0, 0, 0, 0.5)',
        'smoke-400': 'rgba(0, 0, 0, 0.4)',
        'smoke-200': 'rgba(0, 0, 0, 0.25)',
        'smoke-100': 'rgba(0, 0, 0, 0.1)',
      },
    }
  },
  variants: {
    borderWidth: ['responsive', 'focus'],
    margin: ['responsive', 'focus']
  },
  plugins: []
}
