describe('Widget', () => {
  beforeEach(() => {
    cy.reload()
  })
  it('Should mount and display widget', () => {
    cy.visit('http://localhost:8080', {
      timeout: 4000,
    })
    cy.get('.yotpo-${{ values.widget_name }}-widget').should('be.visible')
  })
})
