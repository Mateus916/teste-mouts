class HomeClientePage {
  elementos = {
    campoPesquisa: () => cy.getByTestId('pesquisar'),
    botaoLogout: () => cy.getByTestId('logout'),
  };
}

export default new HomeClientePage();
