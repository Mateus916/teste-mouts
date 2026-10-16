class HomeAdminPage {
  elementos = {
    tituloBoasVindas: () => cy.get('.jumbotron h1'),
    botaoCadastrarProdutos: () => cy.getByTestId('cadastrarProdutos'),
  };

  acessarCadastroDeProdutos() {
    this.elementos.botaoCadastrarProdutos().click();
  }
}

export default new HomeAdminPage();
