import axios from 'axios'

const TOKEN_KEY = 'scorepack_admin_token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
  },
})

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

api.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null)
      window.dispatchEvent(new Event('scorepack:unauthorized'))
    }

    return Promise.reject(error)
  },
)

export function apiErrorMessage(error, fallback = 'Une erreur est survenue.') {
  return error.response?.data?.message || error.response?.data?.errors
    ? Object.values(error.response.data.errors || {})[0]?.[0] || error.response.data.message
    : fallback
}
