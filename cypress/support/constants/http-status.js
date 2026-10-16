/**
 * Códigos HTTP utilizados nas assertivas. Nomeá-los deixa a intenção
 * do teste explícita (`HTTP_STATUS.FORBIDDEN` em vez de um `403` solto).
 */
export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
});
