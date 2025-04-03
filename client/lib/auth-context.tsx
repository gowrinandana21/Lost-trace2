"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  username: string
  email: string
  role: "user" | "admin" | "officer"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // For demo purposes, we'll create a mock user
      // In a real app, you would validate the token with the server
      setUser({
        id: "1",
        username: "admin",
        email: "admin@example.com",
        role: "admin",
      })
    }

    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      // In a real app, this would be a real API call
      // const response = await api.post("/api/auth/login", { username, password });
      // const { token, user } = response.data;

      // For demo purposes
      const token = "mock-jwt-token"
      const mockUser = {
        id: "1",
        username,
        email: `${username}@example.com`,
        role: username === "admin" ? "admin" : username === "officer" ? "officer" : "user",
      }

      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUser(mockUser)
      return mockUser
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

