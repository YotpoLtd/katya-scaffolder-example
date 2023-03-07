/*
**
* If report would fail assertions with `error` severity, PR would be blocked from merging
* Read more about possible assertions https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#assertions
* This file has the same purpose as budget.json you may have seen in docs. Just has another syntax.
* Only one of them can exist at a time.
**
*/

const preset = process.env.LIGHTHOUSE_PRESET || 'desktop'
const minPerfScore = preset === 'mobile' ? 0.8 : 0.85

module.exports = {
  'categories:performance': ['error', { aggregationMethod: 'median', minScore: minPerfScore }],
  'categories:best-practices': ['error', { minScore: 0.95 }],
  'categories:accessibility': ['warn', { minScore: 0.9 }],
  'resource-summary:script:size': ['warn', { 'maxNumericValue': 100 }],
  'resource-summary:font:count': ['warn', { 'maxNumericValue': 1 }],
  'dom-size': ['warn', { 'maxNumericValue': 1000 }],
  'errors-in-console': ['warn', { 'maxLength': 0 }],
  'no-vulnerable-libraries': ['warn', { 'maxLength': 0 }],
  'unused-javascript': ['warn', { 'maxNumericValue': 0.5 }],
  'first-contentful-paint': ['warn', { 'maxNumericValue': 2000 }],
  'color-contrast': 'warn'
}