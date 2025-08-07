describe('Navbar Component', () => {
  beforeEach(() => {
    cy.visit('/stocks')
  })

  it('should display the brand and navigation links', () => {
    cy.contains('📈 StockPWA').should('be.visible')
    cy.contains('Home').should('be.visible')
    cy.contains('Stocks').should('be.visible')
  })

  it('should navigate to the Home page when clicking Home', () => {
    cy.contains('Home').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should navigate to the Stocks page when clicking Stocks', () => {
    cy.contains('Stocks').click()
    cy.url().should('include', '/stocks')
  })

  it('should highlight links on hover (visually tested manually)', () => {
    // Cypress can't test :hover styles directly,
    // but you can confirm the element exists for manual checks
    cy.get('nav').should('exist')
  })
})
