/**
 * Cliente HTTP base da camada de serviços (Service Object).
 *
 * - Centraliza a URL da API e o cabeçalho de autenticação.
 * - Usa `failOnStatusCode: false` para que o próprio teste decida o que é
 *   sucesso ou falha: cenários negativos (400, 401, 403) precisam receber a
 *   resposta para validá-la, e não ter o teste interrompido pelo Cypress.
 */
export class ApiClient {
  static get baseUrl() {
    return Cypress.expose('apiUrl');
  }

  /**
   * @param {{ method: string, path: string, body?: object, qs?: object, token?: string }} options
   * @returns {Cypress.Chainable<Cypress.Response<any>>}
   */
  static request({ method, path, body, qs, token }) {
    return cy.request({
      method,
      url: `${this.baseUrl}${path}`,
      body,
      qs,
      headers: token ? { Authorization: token } : {},
      failOnStatusCode: false,
    });
  }
}
