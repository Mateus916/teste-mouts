import cadastroSucessoSchema from '../../fixtures/schemas/cadastro-sucesso.schema.json';
import mensagemErroSchema from '../../fixtures/schemas/mensagem-erro.schema.json';
import usuarioSchema from '../../fixtures/schemas/usuario.schema.json';
import { HTTP_STATUS } from '../../support/constants/http-status';
import { MENSAGENS } from '../../support/constants/mensagens';
import { UsuarioFactory } from '../../support/factories/usuario.factory';
import { UsuariosService } from '../../support/services/usuarios.service';

describe('API | Usuários', () => {
  context('POST /usuarios', () => {
    it('CT-API-01 - Deve cadastrar um usuário e persistir exatamente os dados enviados', () => {
      // Dado um novo usuário com dados válidos
      const usuario = UsuarioFactory.cliente();

      // Quando o cadastro é solicitado
      UsuariosService.cadastrar(usuario).then((cadastro) => {
        // Então o usuário é criado com sucesso
        expect(cadastro.status).to.eq(HTTP_STATUS.CREATED);
        expect(cadastro.body.message).to.eq(MENSAGENS.CADASTRO_SUCESSO);
        expect(cadastro.body).to.matchSchema(cadastroSucessoSchema);

        const { _id: id } = cadastro.body;
        cy.agendarExclusao({ recurso: 'usuarios', id });

        // E pode ser consultado pelo id retornado, com os mesmos dados enviados
        UsuariosService.buscarPorId(id).then((consulta) => {
          expect(consulta.status).to.eq(HTTP_STATUS.OK);
          expect(consulta.body).to.matchSchema(usuarioSchema);
          expect(consulta.body).to.deep.eq({ ...usuario, _id: id });
        });
      });
    });

    it('CT-API-02 - Não deve permitir cadastrar um usuário com e-mail já utilizado', () => {
      // Dado um usuário já cadastrado
      const usuarioExistente = UsuarioFactory.cliente();
      cy.cadastrarUsuarioViaApi(usuarioExistente);

      // Quando outro usuário tenta se cadastrar com o mesmo e-mail
      const usuarioComEmailDuplicado = UsuarioFactory.administrador({ email: usuarioExistente.email });

      UsuariosService.cadastrar(usuarioComEmailDuplicado).then(({ status, body }) => {
        // Então o cadastro é rejeitado pela regra de e-mail único
        expect(status).to.eq(HTTP_STATUS.BAD_REQUEST);
        expect(body).to.matchSchema(mensagemErroSchema);
        expect(body.message).to.eq(MENSAGENS.EMAIL_JA_UTILIZADO);
      });

      // E continua existindo um único usuário com esse e-mail, sem alterações
      UsuariosService.listar({ email: usuarioExistente.email }).then(({ status, body }) => {
        expect(status).to.eq(HTTP_STATUS.OK);
        expect(body.quantidade).to.eq(1);
        expect(body.usuarios[0]).to.include({
          nome: usuarioExistente.nome,
          administrador: usuarioExistente.administrador,
        });
      });
    });
  });
});
