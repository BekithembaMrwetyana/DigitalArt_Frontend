import axios from 'axios'

const API_BASE_URL = process.env.VUE_APP_API_URL || 'https://api.artspace.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ===== SERVICES/ARTWORKSERVICE.JS =====
import api from './api'

export const artworkService = {
  // Get all artworks
  getAll: () => api.get('/artworks'),
  
  // Get artwork by ID
  getById: (id) => api.get(`/artworks/${id}`),
  
  // Search artworks
  search: (filters) => api.post('/artworks/search', filters),
  
  // Get featured artworks
  getFeatured: () => api.get('/artworks/featured'),
  
  // Get artworks by category
  getByCategory: (category) => api.get(`/artworks/category/${category}`),
  
  // Get artworks by artist
  getByArtist: (artistId) => api.get(`/artworks/artist/${artistId}`),
  
  // Purchase artwork
  purchase: (artworkId, paymentData) => 
    api.post(`/artworks/${artworkId}/purchase`, paymentData),
  
  // Add to wishlist
  addToWishlist: (artworkId) => 
    api.post(`/artworks/${artworkId}/wishlist`),
  
  // Remove from wishlist
  removeFromWishlist: (artworkId) => 
    api.delete(`/artworks/${artworkId}/wishlist`)
}