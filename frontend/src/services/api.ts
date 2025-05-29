import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = localStorage.getItem('token');

const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

if (authToken) {
  setAuthToken(authToken);
}

const auth = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      console.error('Login API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error: any) {
      console.error('Registration API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },
};

const users = {
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error: any) {
      console.error('Get Current User API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch user data');
    }
  },
};

const admin = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error: any) {
      console.error('Get Dashboard Stats API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  },

  getRecentAppointments: async () => {
    try {
      const response = await api.get('/admin/dashboard/recent-appointments');
      return response.data;
    } catch (error: any) {
      console.error('Get Recent Appointments API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch recent appointments');
    }
  },

  getRecentUsers: async () => {
    try {
      const response = await api.get('/admin/dashboard/recent-users');
      return response.data;
    } catch (error: any) {
      console.error('Get Recent Users API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch recent users');
    }
  },
};

const services = {
  getAll: async () => {
    const response = await axios.get('/api/services');
    return response.data;
  },
  getServiceById: async (id: string) => {
    const response = await axios.get(`/api/services/${id}`);
    return response.data;
  }
}
const appointments = {
  create: async (data: any) => {
    const response = await axios.post('/api/appointments', data);
    return response.data;
  },
  getAvailableSlots: async (date: string, serviceId: string) => {
    const response = await axios.get(`/api/appointments/slots?date=${date}&serviceId=${serviceId}`);
    return response.data;
  },
  createPaymentIntent: async (data: any) => {
    const response = await axios.post('/api/appointments/create-payment-intent', data);
    return response.data;
  },
 
};

export default api;
export {
  auth,
  users,
  admin,
  services,
  setAuthToken,
  appointments
};
