const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    env: {
      BACKEND: 'http://localhost:3001/api'
    },
    setupNodeEvents(_, config) {
      return config
    }
  }
})