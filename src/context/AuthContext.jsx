import { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { generateBookingId } from '../utils/formatters'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useLocalStorage('fixbhai_user',  null)
  const [token, setToken] = useLocalStorage('fixbhai_token', null)

  const login = (userData, authToken) => {
    setToken(authToken)
    setUser(userData)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = Boolean(user && token)

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
