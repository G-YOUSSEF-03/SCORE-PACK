import { api, setAuthToken } from './client.js'

export async function loginAdmin(credentials) {
  const { data } = await api.post('/auth/login', credentials)
  setAuthToken(data.token)
  return data
}

export async function logoutAdmin() {
  try {
    await api.post('/auth/logout')
  } finally {
    setAuthToken(null)
  }
}

export async function fetchAdminProfile() {
  const { data } = await api.get('/auth/profile')
  return data.data
}
