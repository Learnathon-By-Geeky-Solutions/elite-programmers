import axios from 'axios'
import { getAuthToken, removeAuthToken } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:9998'
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = getAuthToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(new Error(error.message ?? 'Request failed'))
  }
)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== 'undefined') {
        removeAuthToken();
        window.location.href = '/';
      }
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }
    const errorMessage = error.response?.data?.message ?? error.message ?? 'An unexpected error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);


export default api
