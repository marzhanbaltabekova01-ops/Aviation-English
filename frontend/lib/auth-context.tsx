'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { User } from '@/types'
import { authApi } from './api'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    passwordConfirm: string
    specialization: string
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage on mount
    const storedToken = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })
      const { access_token, user: userData } = response

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))

      setToken(access_token)
      setUser(userData)
    } catch (error) {
      throw error
    }
  }, [])

  const register = useCallback(async (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    passwordConfirm: string
    specialization: string
  }) => {
    try {
      const response = await authApi.register(data as any)
      const { access_token, user: userData } = response

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))

      setToken(access_token)
      setUser(userData)
    } catch (error) {
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
