const assertions = require('./lighthouse.assertions')
const preset = process.env.LIGHTHOUSE_PRESET || 'desktop'
const suite = process.env.LIGHTHOUSE_SUITE || 'default'

const cpuSlowdownMultiplier = preset === 'mobile' ? 2.5 : 1.5

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run lhci:run',
      startServerReadyPattern: 'compiled|successfully|served',
      startServerReadyTimeout: 15000,
      url: ['${{values.url}}'],
      numberOfRuns: 2,
      settings: {
        preset: preset === 'desktop' ? preset : undefined,
        throttling: {
          cpuSlowdownMultiplier: cpuSlowdownMultiplier
        }
      }
    },
    upload: {
      target: 'temporary-public-storage'
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: assertions
    }
  }
}
