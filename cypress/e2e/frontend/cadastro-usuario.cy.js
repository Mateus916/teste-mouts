import { HTTP_STATUS } from '../../support/constants/http-status';
import { MENSAGENS } from '../../support/constants/mensagens';
import { ROTAS, STORAGE_KEYS } from '../../support/constants/rotas';
import { UsuarioFactory } from '../../support/factories/usuario.factory';
import CadastroUsuarioPage from '../../support/pages/cadastro-usuario.page';
import HomeClientePage from '../../support/pages/home-cliente.page';

describe('Frontend | Cadastro de usuário', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/usuarios').as('cadastrarUsuario');
  });

  it('CT-FE-01 - Deve cadastrar um novo cliente e acessar a loja já autenticado', () => {
    // Dado que um visitante acessa a tela de cadastro
    const usuario = UsuarioFactory.cliente();
    CadastroUsuarioPage.visitar();

    // Quando ele preenche o formulário com dados válidos e confirma
    CadastroUsuarioPage.cadastrar(usuario);

    // Então a API recebe exatamente os dados informados e cria o usuário
    cy.wait('@cadastrarUsuario').then(({ request, response }) => {
      expect(request.body).to.deep.eq(usuario);
      expect(response.statusCode).to.eq(HTTP_STATUS.CREATED);
      cy.agendarExclusao({ recurso: 'usuarios', id: response.body._id });
    });

    // E a mensagem de sucesso é exibida
    CadastroUsuarioPage.elementos
      .alertaSucesso()
      .should('be.visible')
      .and('contain.text', MENSAGENS.CADASTRO_SUCESSO);

    // E ele é levado à home da loja, com sessão ativa
    cy.location('pathname', { timeout: 15000 }).should('eq', ROTAS.HOME_CLIENTE);
    HomeClientePage.elementos.campoPesquisa().should('be.visible');
    HomeClientePage.elementos.botaoLogout().should('be.visible');
    cy.window()
      .its('localStorage')
      .invoke('getItem', STORAGE_KEYS.TOKEN)
      .should('match', /^Bearer \S+$/);
  });
});
