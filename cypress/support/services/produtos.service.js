import { ApiClient } from './api.client';

const RECURSO = '/produtos';

export class ProdutosService {
  /** POST /produtos (rota exclusiva para administradores) */
  static cadastrar(produto, token) {
    return ApiClient.request({ method: 'POST', path: RECURSO, body: produto, token });
  }

  /** GET /produtos?{filtros} */
  static listar(filtros = {}) {
    return ApiClient.request({ method: 'GET', path: RECURSO, qs: filtros });
  }

  /** DELETE /produtos/{_id} (rota exclusiva para administradores) */
  static excluir(id, token) {
    return ApiClient.request({ method: 'DELETE', path: `${RECURSO}/${id}`, token });
  }
}
