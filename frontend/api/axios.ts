/**
 * Configuração do cliente Axios para comunicação com a API backend.
 * 
 * Este módulo configura uma instância do Axios com interceptors para:
 * - Adicionar automaticamente o token de autenticação nas requisições
 * - Redirecionar para login em caso de erro 401 (não autorizado)
 */

import axios from 'axios';

/**
 * Instância do Axios configurada com a URL base da API.
 */
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', 
});

/**
 * Interceptor de requisição que adiciona o token de autenticação
 * do localStorage ao header Authorization de todas as requisições.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de resposta que trata erros de autenticação.
 * 
 * Se uma resposta retornar status 401 (não autorizado), remove o token
 * do localStorage e redireciona o usuário para a página de login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;