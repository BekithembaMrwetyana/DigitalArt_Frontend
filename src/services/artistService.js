import api from './api'

export const artistService = {
  // Get all artists
  getAll: () => api.get('/artists'),
  
  // Get artist by ID
  getById: (id) => api.get(`/artists/${id}`),
  
  // Get artist's artworks
  getArtworks: (artistId) => api.get(`/artists/${artistId}/artworks`),
  
  // Follow artist
  follow: (artistId) => api.post(`/artists/${artistId}/follow`),
  
  // Unfollow artist
  unfollow: (artistId) => api.delete(`/artists/${artistId}/follow`),
  
  // Apply as artist
  apply: (applicationData) => api.post('/artists/apply', applicationData)
}