import { fakerPT_BR as faker } from '@faker-js/faker';

/**
 * Factory de produtos. O ServeRest exige nome único, preço e quantidade
 * inteiros — por isso o sufixo aleatório no nome e o uso de `faker.number.int`.
 */
export const ProdutoFactory = Object.freeze({
  /**
   * @param {Partial<{nome: string, preco: number, descricao: string, quantidade: number}>} overrides
   */
  build(overrides = {}) {
    return {
      nome: `${faker.commerce.productName()} ${faker.string.alphanumeric({ length: 8, casing: 'upper' })}`,
      preco: faker.number.int({ min: 10, max: 5000 }),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.number.int({ min: 1, max: 500 }),
      ...overrides,
    };
  },
});
