import { HTTP_STATUS } from '../constants/http-status';
import { LoginService } from '../services/login.service';
import { UsuariosService } from '../services/usuarios.service';

/**
 * Comandos de preparação (arrange) via API.
 *
 * Montar o cenário pela API em vez da interface deixa os testes mais rápidos
 * e estáveis, e concentra cada teste naquilo que ele realmente quer validar.
 * As assertivas aqui são "guardas": se a pré-condição falhar, o teste para
 * com uma mensagem clara, em vez de quebrar mais adiante sem contexto.
 */

Cypress.Commands.add('cadastrarUsuarioViaApi', (usuario) => {
  return UsuariosService.cadastrar(usuario).then(({ status, body }) => {
    expect(status, `pré-condição: cadastrar o usuário ${usuario.email}`).to.eq(HTTP_STATUS.CREATED);
    cy.agendarExclusao({ recurso: 'usuarios', id: body._id });
    return cy.wrap(body._id, { log: false });
  });
});

Cypress.Commands.add('obterTokenViaApi', (credenciais) => {
  return LoginService.autenticar(credenciais).then(({ status, body }) => {
    expect(status, `pré-condição: autenticar ${credenciais.email}`).to.eq(HTTP_STATUS.OK);
    return cy.wrap(body.authorization, { log: false });
  });
});
