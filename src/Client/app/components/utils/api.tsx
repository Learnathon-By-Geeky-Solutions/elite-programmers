import axios from 'axios'
import { getAuthToken, removeAuthToken } from './auth'

const api = axios.create({
  baseURL: `${process.env.TRUETEST_URL}/api/`,
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
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        if (typeof window !== 'undefined') {
          removeAuthToken()
          window.location.href = '/login'
        }
        return Promise.reject(new Error('Unauthorized - Please log in again.'))
      } catch {
        if (typeof window !== 'undefined') {
          removeAuthToken()
          window.location.href = '/login'
        }
        return Promise.reject(new Error('Error during token refresh. Please log in again.'))
      }
    }
    return Promise.reject(new Error(error.message || 'An unexpected error occurred.'))
  }
)

export default api
