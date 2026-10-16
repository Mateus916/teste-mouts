/**
 * Rotas do frontend (https://front.serverest.dev).
 */
export const ROTAS = Object.freeze({
  LOGIN: '/login',
  CADASTRO_USUARIO: '/cadastrarusuarios',
  HOME_CLIENTE: '/home',
  HOME_ADMIN: '/admin/home',
  CADASTRO_PRODUTO: '/admin/cadastrarprodutos',
  LISTAGEM_PRODUTOS: '/admin/listarprodutos',
});

/**
 * Chaves que o frontend utiliza no localStorage para manter a sessão.
 */
export const STORAGE_KEYS = Object.freeze({
  TOKEN: 'serverest/userToken',
  EMAIL: 'serverest/userEmail',
});
