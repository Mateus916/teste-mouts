class CadastroProdutoPage {
  elementos = {
    campoNome: () => cy.getByTestId('nome'),
    campoPreco: () => cy.getByTestId('preco'),
    campoDescricao: () => cy.getByTestId('descricao'),
    campoQuantidade: () => cy.getByTestId('quantity'),
    // O "cadastarProdutos" (sem o "r") é o data-testid real da aplicação.
    botaoCadastrar: () => cy.getByTestId('cadastarProdutos'),
  };

  cadastrar({ nome, preco, descricao, quantidade }) {
    this.elementos.campoNome().type(nome);
    this.elementos.campoPreco().type(String(preco));
    this.elementos.campoDescricao().type(descricao);
    this.elementos.campoQuantidade().type(String(quantidade));
    this.elementos.botaoCadastrar().click();
  }
}

export default new CadastroProdutoPage();
