import { HTTP_STATUS } from '../../support/constants/http-status';
import { MENSAGENS } from '../../support/constants/mensagens';
import { ROTAS } from '../../support/constants/rotas';
import { ProdutoFactory } from '../../support/factories/produto.factory';
import { UsuarioFactory } from '../../support/factories/usuario.factory';
import CadastroProdutoPage from '../../support/pages/cadastro-produto.page';
import HomeAdminPage from '../../support/pages/home-admin.page';
import ListagemProdutosPage, { COLUNAS_PRODUTO } from '../../support/pages/listagem-produtos.page';
import LoginPage from '../../support/pages/login.page';

describe('Frontend | Gestão de produtos (administrador)', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/produtos').as('cadastrarProduto');
  });

  it('CT-FE-03 - Administrador deve cadastrar um produto e visualizá-lo na listagem', () => {
    // Dado um administrador cadastrado
    const administrador = UsuarioFactory.administrador();
    const produto = ProdutoFactory.build();
    cy.cadastrarUsuarioViaApi(administrador);

    // E autenticado no painel administrativo
    LoginPage.visitar();
    LoginPage.realizarLogin(administrador);
    cy.location('pathname').should('eq', ROTAS.HOME_ADMIN);
    HomeAdminPage.elementos
      .tituloBoasVindas()
      .should('contain.text', 'Bem Vindo')
      .and('contain.text', administrador.nome);

    // Quando ele cadastra um novo produto
    HomeAdminPage.acessarCadastroDeProdutos();
    cy.location('pathname').should('eq', ROTAS.CADASTRO_PRODUTO);
    CadastroProdutoPage.cadastrar(produto);

    // Então a API registra o produto
    cy.wait('@cadastrarProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(HTTP_STATUS.CREATED);
      expect(response.body.message).to.eq(MENSAGENS.CADASTRO_SUCESSO);
      cy.agendarExclusao({ recurso: 'produtos', id: response.body._id, credenciais: administrador });
    });

    // E ele é levado à listagem, onde o produto aparece com os dados informados
    cy.location('pathname').should('eq', ROTAS.LISTAGEM_PRODUTOS);
    ListagemProdutosPage.elementos.titulo().should('have.text', 'Lista dos Produtos');
    ListagemProdutosPage.celulasDoProduto(produto.nome).should(($celulas) => {
      expect($celulas.eq(COLUNAS_PRODUTO.NOME)).to.have.text(produto.nome);
      expect($celulas.eq(COLUNAS_PRODUTO.PRECO)).to.have.text(String(produto.preco));
      expect($celulas.eq(COLUNAS_PRODUTO.DESCRICAO)).to.have.text(produto.descricao);
      expect($celulas.eq(COLUNAS_PRODUTO.QUANTIDADE)).to.have.text(String(produto.quantidade));
    });
  });
});
