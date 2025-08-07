describe('Landing Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays the correct title and description', () => {
    cy.contains('Real-Time Stock Tracker').should('be.visible');
    cy.contains('Get live updates on stock prices').should('be.visible');
  });

  it('has a working "View Stocks" button', () => {
    cy.contains('View Stocks')
      .should('be.visible')
      .click();

    cy.url().should('include', '/stocks');
  });
});
