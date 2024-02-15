const { defineConfig } = require('cypress')
const { initPlugin } = require('./cypress/plugins/index.js')

module.exports = defineConfig({
  chromeWebSecurity: true,
  videoUploadOnPasses: false,
  watchForFileChanges: false,
  pageLoadTimeout: 90000,
  defaultCommandTimeout: 200000,
  responseTimeout: 200000,
  viewportWidth: 1920,
  viewportHeight: 1066,

  e2e: {
    baseUrl: 'https://domain-from-env-file.com',
    specPattern: ['cypress/integration/*.js'],
    excludeSpecPattern: '*.ignore.js',
    supportFile: 'cypress/support/*.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      return initPlugin(on, config)
    },
  },
  env: {
    locale: 'cz',
    url: {
      graphQL: 'graphql',
    },
  },
})
