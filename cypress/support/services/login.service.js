import { ApiClient } from './api.client';

export class LoginService {
  /** POST /login */
  static autenticar({ email, password }) {
    return ApiClient.request({ method: 'POST', path: '/login', body: { email, password } });
  }
}
