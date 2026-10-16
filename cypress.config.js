const { defineConfig } = require('cypress');

/**
 * As URLs podem ser sobrescritas por variáveis de ambiente, o que permite
 * executar a mesma suíte contra ambientes diferentes (ex.: ServeRest local)
 * sem alterar código:
 *
 *   BASE_URL=http://localhost:3001 API_URL=http://localhost:3000 npm test
 */
const BASE_URL = process.env.BASE_URL || 'https://front.serverest.dev';
const API_URL = process.env.API_URL || 'https://serverest.dev';

module.exports = defineConfig({
  e2e: {
    baseUrl: BASE_URL,
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 30000,
    // O ServeRest público é um ambiente compartilhado: uma nova tentativa em
    // modo headless absorve instabilidades de rede sem mascarar falhas reais
    // (um teste que falha duas vezes seguidas continua reprovando a execução).
    retries: { runMode: 1, openMode: 0 },
    video: false,
    screenshotOnRunFailure: true,
    expose: {
      apiUrl: API_URL,
    },
  },
});
