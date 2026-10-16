import { ApiClient } from './api.client';

const RECURSO = '/usuarios';

export class UsuariosService {
  /** POST /usuarios */
  static cadastrar(usuario) {
    return ApiClient.request({ method: 'POST', path: RECURSO, body: usuario });
  }

  /** GET /usuarios?{filtros} */
  static listar(filtros = {}) {
    return ApiClient.request({ method: 'GET', path: RECURSO, qs: filtros });
  }

  /** GET /usuarios/{_id} */
  static buscarPorId(id) {
    return ApiClient.request({ method: 'GET', path: `${RECURSO}/${id}` });
  }

  /** DELETE /usuarios/{_id} */
  static excluir(id) {
    return ApiClient.request({ method: 'DELETE', path: `${RECURSO}/${id}` });
  }
}
