import { ROTAS } from '../constants/rotas';

class CadastroUsuarioPage {
  elementos = {
    campoNome: () => cy.getByTestId('nome'),
    campoEmail: () => cy.getByTestId('email'),
    campoSenha: () => cy.getByTestId('password'),
    checkboxAdministrador: () => cy.getByTestId('checkbox'),
    botaoCadastrar: () => cy.getByTestId('cadastrar'),
    alertaSucesso: () => cy.get('.alert-primary'),
  };

  visitar() {
    cy.visit(ROTAS.CADASTRO_USUARIO);
  }

  cadastrar({ nome, email, password, administrador }) {
    this.elementos.campoNome().type(nome);
    this.elementos.campoEmail().type(email);
    this.elementos.campoSenha().type(password, { log: false });

    if (administrador === 'true') {
      this.elementos.checkboxAdministrador().check();
    }

    this.elementos.botaoCadastrar().click();
  }
}

export default new CadastroUsuarioPage();
