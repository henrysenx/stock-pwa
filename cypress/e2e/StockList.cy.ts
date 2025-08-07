describe('Stock Listing Page', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '**/stock/symbol?exchange=US&token=*',
      { fixture: 'stocks.json' } // Mocked response
    ).as('getStocks');

    cy.visit('/stocks'); // Adjust to your route if needed
    cy.wait('@getStocks');
  });

  it('renders MIC tabs based on response data', () => {
    cy.get('button').contains('XNAS').should('exist');
    cy.get('button').contains('XNYS').should('exist');
  });

  it('displays stock cards after loading', () => {
    cy.get('[data-cy=stock-card]').should('have.length.at.least', 1);
  });

  it('filters stocks using search input', () => {
    cy.get('input[placeholder="Search by symbol or name"]')
      .type('Apple');
    cy.get('[data-cy=stock-card]').should('contain.text', 'Apple Inc.');
  });

  it('navigates to stock detail page on card click', () => {
    cy.get('[data-cy=stock-card]').first().click();
    cy.url().should('include', '/stocks/');
  });
});
