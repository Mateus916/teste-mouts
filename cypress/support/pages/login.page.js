import { ROTAS } from '../constants/rotas';

class LoginPage {
  elementos = {
    campoEmail: () => cy.getByTestId('email'),
    campoSenha: () => cy.getByTestId('senha'),
    botaoEntrar: () => cy.getByTestId('entrar'),
    alertaErro: () => cy.get('[role="alert"]'),
  };

  visitar() {
    cy.visit(ROTAS.LOGIN);
  }

  realizarLogin({ email, password }) {
    this.elementos.campoEmail().type(email);
    this.elementos.campoSenha().type(password, { log: false });
    this.elementos.botaoEntrar().click();
  }
}

export default new LoginPage();
