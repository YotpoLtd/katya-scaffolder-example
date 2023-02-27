import '@yotpo-common/cypress-utils'

// repeats structure of cypress.json + plugins
export interface CypressEnvConfig {
  username: string
  password: string
}

declare global {
  namespace Cypress {
    interface Cypress {
      env(): CypressEnvConfig
    }

    interface Chainable {

    }
  }
}
