import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Vérifier si un token existe dans le localStorage
    const token = localStorage.getItem('token')
    if (token) {
      try {
        // Vérifier si le token est expiré
        const decodedToken = jwt_decode(token)
        const currentTime = Date.now() / 1000

        if (decodedToken.exp < currentTime) {
          // Token expiré, déconnecter l'utilisateur
          logout()
        } else {
          // Token valide, définir l'utilisateur actuel
          setCurrentUser(decodedToken)
          // Configurer l'en-tête d'autorisation pour toutes les requêtes
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error)
        logout()
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      // Appel à l'API pour l'authentification
      const response = await axios.post('/api/auth/login', { email, password })
      const { token, user } = response.data
      
      // Stocker le token dans le localStorage
      localStorage.setItem('token', token)
      
      // Configurer l'en-tête d'autorisation pour toutes les requêtes
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Mettre à jour l'état de l'utilisateur
      setCurrentUser(user)
      
      return user
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la connexion')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      
      // Appel à l'API pour l'enregistrement
      const response = await axios.post('/api/auth/register', userData)
      
      return response.data
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'inscription')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token')
    
    // Supprimer l'en-tête d'autorisation
    delete axios.defaults.headers.common['Authorization']
    
    // Réinitialiser l'état de l'utilisateur
    setCurrentUser(null)
  }

  const resetPassword = async (email) => {
    try {
      setLoading(true)
      setError(null)
      
      // Appel à l'API pour la réinitialisation du mot de passe
      const response = await axios.post('/api/auth/reset-password', { email })
      
      return response.data
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      
      // Appel à l'API pour la mise à jour du profil
      const response = await axios.put('/api/users/profile', userData)
      
      // Mettre à jour l'état de l'utilisateur
      setCurrentUser({ ...currentUser, ...response.data })
      
      return response.data
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la mise à jour du profil')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}