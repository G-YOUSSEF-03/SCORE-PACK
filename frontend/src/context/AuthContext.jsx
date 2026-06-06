/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchAdminProfile, loginAdmin, logoutAdmin } from '../api/auth.js'
import { getAuthToken } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getAuthToken())
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))

  const refreshProfile = useCallback(async () => {
    if (!getAuthToken()) {
      setUser(null)
      setLoading(false)
      return null
    }

    setLoading(true)
    try {
      const profile = await fetchAdminProfile()
      setUser(profile)
      return profile
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshProfile().catch(() => {
      setUser(null)
      setToken(null)
      setLoading(false)
    })

    const onUnauthorized = () => {
      setUser(null)
      setToken(null)
    }

    window.addEventListener('scorepack:unauthorized', onUnauthorized)
    return () => window.removeEventListener('scorepack:unauthorized', onUnauthorized)
  }, [refreshProfile])

  const login = useCallback(async (credentials) => {
    const data = await loginAdmin(credentials)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    await logoutAdmin()
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    login,
    logout,
    refreshProfile,
  }), [loading, login, logout, refreshProfile, token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return value
}
