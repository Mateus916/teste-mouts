import { fakerPT_BR as faker } from '@faker-js/faker';

/**
 * Factory de usuários: cada chamada gera uma massa de dados nova e única,
 * o que mantém os testes independentes entre si e seguros para rodar
 * em paralelo num ambiente compartilhado como o ServeRest público.
 */
const gerarEmailUnico = () =>
  `qa.${Date.now()}.${faker.string.alphanumeric({ length: 6, casing: 'lower' })}@serverest-e2e.com`;

export const UsuarioFactory = Object.freeze({
  /**
   * @param {Partial<{nome: string, email: string, password: string, administrador: 'true' | 'false'}>} overrides
   */
  cliente(overrides = {}) {
    return {
      nome: faker.person.fullName(),
      email: gerarEmailUnico(),
      password: faker.internet.password({ length: 12, memorable: false }),
      administrador: 'false',
      ...overrides,
    };
  },

  administrador(overrides = {}) {
    return this.cliente({ administrador: 'true', ...overrides });
  },
});
