import axios from 'axios'

// Configuration de base pour axios
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Création d'une instance axios avec une configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Service pour les annonces
const annoncesService = {
  // Récupérer toutes les annonces
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/annonces', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // Récupérer une annonce par son ID
  getById: async (id) => {
    try {
      const response = await api.get(`/annonces/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // Créer une nouvelle annonce
  create: async (annonceData) => {
    try {
      const formData = new FormData()
      
      // Ajouter les champs textuels
      Object.keys(annonceData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, annonceData[key])
        }
      })
      
      // Ajouter les images
      if (annonceData.images && annonceData.images.length > 0) {
        annonceData.images.forEach((file, index) => {
          formData.append(`image_${index}`, file)
        })
      }
      
      const response = await api.post('/annonces', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // Mettre à jour une annonce
  update: async (id, annonceData) => {
    try {
      const formData = new FormData()
      
      // Ajouter les champs textuels
      Object.keys(annonceData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, annonceData[key])
        }
      })
      
      // Ajouter les images
      if (annonceData.images && annonceData.images.length > 0) {
        annonceData.images.forEach((file, index) => {
          formData.append(`image_${index}`, file)
        })
      }
      
      const response = await api.put(`/annonces/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // Supprimer une annonce
  delete: async (id) => {
    try {
      const response = await api.delete(`/annonces/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

// Service pour les catégories
const categoriesService = {
  // Récupérer toutes les catégories
  getAll: async () => {
    try {
      const response = await api.get('/categories')
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // Récupérer les sous-catégories d'une catégorie
  getSubcategories: async (categoryId) => {
    try {
      const response = await api.get(`/categories/${categoryId}/subcategories`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

// Service pour les localisations
const locationsService = {
  // Rechercher des villes
  search: async (query) => {
    try {
      const response = await api.get('/locations/search', { params: { query } })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export { api, annoncesService, categoriesService, locationsService }