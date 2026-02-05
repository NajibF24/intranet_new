import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gys_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const apiService = {
  // Auth
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),

  // News
  getNews: (params) => api.get('/news', { params }),
  getNewsById: (id) => api.get(`/news/${id}`),
  createNews: (data) => api.post('/news', data),
  updateNews: (id, data) => api.put(`/news/${id}`, data),
  deleteNews: (id) => api.delete(`/news/${id}`),

  // Events
  getEvents: (params) => api.get('/events', { params }),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),

  // Photos
  getPhotos: (params) => api.get('/photos', { params }),
  getPhotoById: (id) => api.get(`/photos/${id}`),
  createPhoto: (data) => api.post('/photos', data),
  uploadPhoto: (formData) => api.post('/photos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updatePhoto: (id, data) => api.put(`/photos/${id}`, data),
  deletePhoto: (id) => api.delete(`/photos/${id}`),

  // Albums
  getAlbums: (params) => api.get('/albums', { params }),
  getAlbumById: (id) => api.get(`/albums/${id}`),
  getAlbumPhotos: (id) => api.get(`/albums/${id}/photos`),
  createAlbum: (data) => api.post('/albums', data),
  updateAlbum: (id, data) => api.put(`/albums/${id}`, data),
  deleteAlbum: (id) => api.delete(`/albums/${id}`),

  // Employees
  getEmployees: (params) => api.get('/employees', { params }),
  getEmployeeById: (id) => api.get(`/employees/${id}`),
  createEmployee: (data) => api.post('/employees', data),
  updateEmployee: (id, data) => api.put(`/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),

  // Users (Admin only)
  getUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),

  // Hero Settings
  getHeroSettings: () => api.get('/settings/hero'),
  updateHeroSettings: (data) => api.put('/settings/hero', data),

  // Seed data
  seedData: () => api.post('/seed'),
};

export default api;
