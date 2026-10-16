import { HTTP_STATUS } from '../../support/constants/http-status';
import { MENSAGENS } from '../../support/constants/mensagens';
import { ROTAS, STORAGE_KEYS } from '../../support/constants/rotas';
import { UsuarioFactory } from '../../support/factories/usuario.factory';
import LoginPage from '../../support/pages/login.page';

describe('Frontend | Login', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/login').as('login');
  });

  it('CT-FE-02 - Deve exibir mensagem de erro e não autenticar ao informar senha incorreta', () => {
    // Dado um usuário cadastrado
    const usuario = UsuarioFactory.cliente();
    cy.cadastrarUsuarioViaApi(usuario);

    // Quando ele tenta entrar com o e-mail correto e a senha errada
    LoginPage.visitar();
    LoginPage.realizarLogin({ email: usuario.email, password: `${usuario.password}-incorreta` });

    // Então a API recusa a autenticação
    cy.wait('@login').its('response.statusCode').should('eq', HTTP_STATUS.UNAUTHORIZED);

    // E a tela informa que as credenciais são inválidas
    LoginPage.elementos
      .alertaErro()
      .should('be.visible')
      .and('contain.text', MENSAGENS.LOGIN_INVALIDO);

    // E o usuário permanece deslogado, na tela de login
    cy.location('pathname').should('eq', ROTAS.LOGIN);
    cy.window()
      .its('localStorage')
      .invoke('getItem', STORAGE_KEYS.TOKEN)
      .should('be.null');
  });
});
