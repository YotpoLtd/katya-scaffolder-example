import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {},
    defaultCommandTimeout: 3000,
    video: false,
    screenshotOnRunFailure: true,
  },
})

require('@applitools/eyes-cypress')(module)
