import { LoginService } from '../services/login.service';
import { ProdutosService } from '../services/produtos.service';
import { UsuariosService } from '../services/usuarios.service';

/**
 * Registro de limpeza da massa de dados (teardown).
 *
 * Todo registro criado por um teste é agendado aqui e excluído no `afterEach`
 * global (ver `support/e2e.js`), mesmo quando o teste falha. A exclusão segue
 * a ordem inversa da criação (LIFO): um produto é removido antes do
 * administrador que o cadastrou, enquanto o token desse usuário ainda é válido.
 *
 * A limpeza não faz assertivas de propósito: ela nunca deve mascarar o
 * resultado real do teste.
 */
const exclusoesPendentes = [];

const estrategiasDeExclusao = {
  usuarios: ({ id }) => UsuariosService.excluir(id),
  produtos: ({ id, credenciais }) =>
    LoginService.autenticar(credenciais).then(({ body }) =>
      ProdutosService.excluir(id, body.authorization),
    ),
};

Cypress.Commands.add('agendarExclusao', ({ recurso, id, credenciais }) => {
  if (!estrategiasDeExclusao[recurso]) {
    throw new Error(`Não existe estratégia de exclusão para o recurso "${recurso}".`);
  }
  exclusoesPendentes.push({ recurso, id, credenciais });
});

export const executarExclusoesAgendadas = () => {
  while (exclusoesPendentes.length) {
    const exclusao = exclusoesPendentes.pop();
    estrategiasDeExclusao[exclusao.recurso](exclusao);
  }
};
