const preset = process.env.LIGHTHOUSE_PRESET || 'desktop'

const minPerfScore = preset === 'desktop' ? 0.8 : 0.85
const cpuSlowdownMultiplier = preset === 'mobile' ? 2.5 : 1.5

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run lhci:run',
      startServerReadyPattern: 'compiled|successfully|served',
      startServerReadyTimeout: 60000,
      url: ['http://localhost:8080'],
      numberOfRuns: 5,
      settings: {
        preset: preset === 'desktop' ? preset : undefined,
        throttling: {
          cpuSlowdownMultiplier: cpuSlowdownMultiplier,
        },
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:performance': ['error', { aggregationMethod: 'median', minScore: minPerfScore }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'meta-description': 'off',
        'csp-xss': 'off',
        'uses-rel-preconnect': 'off',
        'color-contrast': 'warn',
        'unused-javascript': ['warn', { maxNumericValue: 0.5 }],
        'resource-summary:script:size': ['warn', { maxNumericValue: 100 }],
        'resource-summary:font:count': ['warn', { maxNumericValue: 1 }],
        'dom-size': ['warn', { maxNumericValue: 1000 }],
        'errors-in-console': ['warn', { maxLength: 0 }],
        'no-vulnerable-libraries': ['warn', { maxLength: 0 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'user-timings:yotpo-promoted-products-widget-loaded': ['error', { maxNumericValue: 700 }],
      },
    },
  },
}
