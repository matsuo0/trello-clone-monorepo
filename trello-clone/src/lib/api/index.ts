import axios from 'axios';
import { addAuthorizationHeader } from './interceptors/request';

const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL,
});
api.defaults.headers.common['Content-Type'] = 'application/json';
api.interceptors.request.use(addAuthorizationHeader);

// レスポンスインターセプターを追加
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;