import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),

  register: (userData) => api.post('/auth/register', userData),

  refresh: () => api.post('/auth/refresh'),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  getProfile: () => api.get('/auth/profile'),

  updateProfile: (profileData) => api.put('/auth/profile', profileData),

  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),

  resetPassword: (email) => api.post('/auth/reset-password', { email }),

  confirmReset: (token, newPassword) => api.post('/auth/confirm-reset', { token, password: newPassword })
};
