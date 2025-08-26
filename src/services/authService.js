import api from './api'

export const authService = {
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Register user
  register: (userData) => api.post('/auth/register', userData),
  
  // Refresh token
  refresh: () => api.post('/auth/refresh'),
  
  // Logout user
  logout: () => api.post('/auth/logout'),
  
  // Get user profile
  getProfile: () => api.get('/auth/profile'),
  
  // Update user profile
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  
  // Change password
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
  
  // Reset password
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
  
  // Confirm password reset
  confirmReset: (token, newPassword) => 
    api.post('/auth/confirm-reset', { token, password: newPassword })
}