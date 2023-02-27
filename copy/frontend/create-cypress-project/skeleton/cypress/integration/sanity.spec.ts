import { AppName } from '@yotpo-common/cypress-utils'

describe('Sanity tests', () => {
  beforeEach(() => {
    const username = Cypress.env().username
    const password = Cypress.env().password
    const apiDomain = Cypress.env().apiDomain
    cy.loginByApi(username, password, {appName: AppName.${{values.product }}, apiDomain } )
  })

  it('Test something', () => {
    cy.visit(`https://yotpo.com`)
  })

})
