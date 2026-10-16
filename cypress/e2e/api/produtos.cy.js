import mensagemErroSchema from '../../fixtures/schemas/mensagem-erro.schema.json';
import { HTTP_STATUS } from '../../support/constants/http-status';
import { MENSAGENS } from '../../support/constants/mensagens';
import { ProdutoFactory } from '../../support/factories/produto.factory';
import { UsuarioFactory } from '../../support/factories/usuario.factory';
import { ProdutosService } from '../../support/services/produtos.service';

describe('API | Produtos', () => {
  context('POST /produtos', () => {
    it('CT-API-03 - Não deve permitir que um usuário não administrador cadastre produtos', () => {
      // Dado um usuário autenticado que não é administrador
      const cliente = UsuarioFactory.cliente();
      const produto = ProdutoFactory.build();
      cy.cadastrarUsuarioViaApi(cliente);

      // Quando ele tenta cadastrar um produto com o próprio token
      cy.obterTokenViaApi(cliente)
        .then((token) => ProdutosService.cadastrar(produto, token))
        .then(({ status, body }) => {
          // Então o acesso é negado por falta de permissão
          expect(status).to.eq(HTTP_STATUS.FORBIDDEN);
          expect(body).to.matchSchema(mensagemErroSchema);
          expect(body.message).to.eq(MENSAGENS.ROTA_EXCLUSIVA_ADMIN);
        });

      // E o produto não é persistido
      ProdutosService.listar({ nome: produto.nome }).then(({ status, body }) => {
        expect(status).to.eq(HTTP_STATUS.OK);
        expect(body.quantidade).to.eq(0);
        expect(body.produtos).to.be.empty;
      });
    });
  });
});
