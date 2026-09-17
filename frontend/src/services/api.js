import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include CSRF token if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if using JWT
    return config;
  },
  (error) => Promise.reject(error)
);

// Listing API calls
export const listingAPI = {
  getAll: () => api.get('/listings'),
  getById: (id) => api.get(`/listings/${id}`),
  create: (formData) => api.post('/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/listings/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/listings/${id}`),
  checkAvailability: (id, dates) => api.get(`/listings/${id}/availability`, { params: dates }),
  book: (id, dates) => api.post(`/listings/${id}/book`, dates),
};

// Review API calls
export const reviewAPI = {
  create: (listingId, reviewData) => api.post(`/listings/${listingId}/reviews`, { review: reviewData }),
  delete: (listingId, reviewId) => api.delete(`/listings/${listingId}/reviews/${reviewId}`),
};

// Auth API calls
export const authAPI = {
  signup: (userData) => api.post('/users/signup', userData),
  login: (credentials) => api.post('/users/login', credentials),
  logout: () => api.post('/users/logout'),
  getCurrentUser: () => api.get('/users/me'),
  getBookings: () => api.get('/users/bookings'),
};

export default api;