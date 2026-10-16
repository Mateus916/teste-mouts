/** Ordem das colunas da tabela "Lista dos Produtos". */
export const COLUNAS_PRODUTO = Object.freeze({
  NOME: 0,
  PRECO: 1,
  DESCRICAO: 2,
  QUANTIDADE: 3,
});

class ListagemProdutosPage {
  elementos = {
    titulo: () => cy.get('.jumbotron h1'),
    linhaDoProduto: (nome) => cy.contains('table tbody tr', nome),
  };

  celulasDoProduto(nome) {
    return this.elementos.linhaDoProduto(nome).find('td');
  }
}

export default new ListagemProdutosPage();
