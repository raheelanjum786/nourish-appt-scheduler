import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const apiService = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    },
    register: async (name: string, email: string, password: string) => {
      const response = await api.post('/auth/register', { name, email, password });
      return response.data;
    },
  },
  services: {
    getAll: async () => {
      const response = await api.get('/services');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(`/services/${id}`);
      return response.data;
    },
  },
  serviceCategories: {
    getAll: async () => {
      const response = await api.get('/service-categories');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(`/service-categories/${id}`);
      return response.data;
    },
    getServicesByCategory: async (categoryId: string) => {
      const response = await api.get(`/service-categories/${categoryId}/services`);
      return response.data;
    },
  },
  appointments: {
    create: async (appointmentData) => {
      const response = await api.post('/appointments', appointmentData);
      return response.data;
    },
    getUserAppointments: async () => {
      const response = await api.get('/appointments/me');
      return response.data;
    },
    cancelAppointment: async (id: string) => {
      const response = await api.put(`/appointments/me/${id}/cancel`);
      return response.data;
    },
  },
  // Add other API endpoints as needed
};

export default apiService;