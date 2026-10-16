import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

/**
 * Assertiva Chai para teste de contrato com JSON Schema.
 * Complementa as assertivas de valor garantindo estrutura, tipos, campos
 * obrigatórios e ausência de campos inesperados na resposta.
 *
 * @example
 *   import usuarioSchema from '../../fixtures/schemas/usuario.schema.json';
 *   expect(response.body).to.matchSchema(usuarioSchema);
 */
chai.use((_chai) => {
  _chai.Assertion.addMethod('matchSchema', function matchSchema(schema) {
    const validar = ajv.compile(schema);
    const contratoRespeitado = validar(this._obj);

    this.assert(
      contratoRespeitado,
      `esperava que a resposta respeitasse o contrato "${schema.title}", mas: ${ajv.errorsText(validar.errors)}`,
      `esperava que a resposta NÃO respeitasse o contrato "${schema.title}"`,
    );
  });
});
