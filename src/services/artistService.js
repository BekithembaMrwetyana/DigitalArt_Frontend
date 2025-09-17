import api from './api'

export const artistService = {
  
  getAll: () => api.get('/artists'),
  

  getById: (id) => api.get(`/artists/${id}`),
  
  
  getArtworks: (artistId) => api.get(`/artists/${artistId}/artworks`),
  
  
  follow: (artistId) => api.post(`/artists/${artistId}/follow`),
  
  
  unfollow: (artistId) => api.delete(`/artists/${artistId}/follow`),
  
  // Apply as artist
  apply: (applicationData) => api.post('/artists/apply', applicationData)
}