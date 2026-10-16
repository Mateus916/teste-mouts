/**
 * Seleciona elementos pelo atributo `data-testid`, a estratégia de seletor
 * mais resiliente: não depende de estilo (classes CSS), de texto nem da
 * estrutura do DOM, que mudam com frequência.
 */
Cypress.Commands.add('getByTestId', (testId, options = {}) => {
  return cy.get(`[data-testid="${testId}"]`, options);
});
