import axios from 'axios';

// const API_URL = 'http://localhost:5002/api';
// const API_URL = 'https://selfobsession.online/api'
const API_URL = import.meta.env.REACT_APP_API_URL

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
    } catch (error) {
      console.error('Get Current User API error:', error.response?.data || error.message);
    
      throw error;
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

const timeSlots = {
  getAvailable: async (date: string, serviceId?: string) => {
    try {
      const params = new URLSearchParams();
      params.append('date', date);
      if (serviceId) params.append('serviceId', serviceId);
      
      const response = await api.get(`/time-slots/available?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Get Available Time Slots API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch available time slots');
    }
  },
  generateForService: async (data: { 
    serviceId: string, 
    date: string, 
    startTime?: string, 
    endTime?: string 
  }) => {
    try {
      const response = await api.post('/time-slots/generate', data);
      return response.data;
    } catch (error: any) {
      console.error('Generate Time Slots API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to generate time slots');
    }
  },
  generateForAllServices: async (data: { 
    startDate: string, 
    endDate: string, 
    startTime?: string, 
    endTime?: string 
  }) => {
    try {
      const response = await api.post('/time-slots/generate-all', data);
      return response.data;
    } catch (error: any) {
      console.error('Generate All Time Slots API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to generate time slots for all services');
    }
  },

  getAll: async (filters?: { date?: string, status?: string, service?: string }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.date) params.append('date', filters.date);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.service) params.append('service', filters.service);
      
      const response = await api.get(`/time-slots?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Get All Time Slots API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch time slots');
    }
  },
  
  getById: async (id: string) => {
    try {
      const response = await api.get(`/time-slots/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get Time Slot API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch time slot');
    }
  },
  
  create: async (data: { date: string, startTime: string, endTime: string, service?: string }) => {
    try {
      const response = await api.post('/time-slots', data);
      return response.data;
    } catch (error: any) {
      console.error('Create Time Slot API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create time slot');
    }
  },
  
  createBulk: async (slots: Array<{ date: string, startTime: string, endTime: string, service?: string }>) => {
    try {
      const response = await api.post('/time-slots/bulk', { slots });
      return response.data;
    } catch (error: any) {
      console.error('Create Bulk Time Slots API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create time slots');
    }
  },
  
  update: async (id: string, data: { date?: string, startTime?: string, endTime?: string, status?: string, service?: string }) => {
    try {
      const response = await api.put(`/time-slots/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Update Time Slot API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update time slot');
    }
  },
  
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/time-slots/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete Time Slot API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete time slot');
    }
  },
  
  book: async (timeSlotId: string, appointmentId: string) => {
    try {
      const response = await api.post('/time-slots/book', { timeSlotId, appointmentId });
      return response.data;
    } catch (error: any) {
      console.error('Book Time Slot API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to book time slot');
    }
  },
  
  release: async (timeSlotId: string) => {
    try {
      const response = await api.post('/time-slots/release', { timeSlotId });
      return response.data;
    } catch (error: any) {
      console.error('Release Time Slot API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to release time slot');
    }
  },
};

const appointments = {
  create: async (data: any) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },
  getAvailableSlots: async (date: string, serviceId: string) => {
    return timeSlots.getAvailable(date, serviceId);
  },
  createPaymentIntent: async (data: any) => {
    const response = await api.post('/appointments/create-payment-intent', data);
    return response.data;
  },
  getUserAppointments: async () => {
    const response = await api.get('/appointments/me');
    return response.data;
  },
  cancelUserAppointment: async (id: string) => {
    const response = await api.put(`/appointments/me/${id}/cancel`);
    return response.data;
  },
  getUserAppointmentById: async (id: string) => {
    const response = await api.get(`/appointments/me/${id}`);
    return response.data;
  },
  getAllAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
  getAppointmentById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  updateAppointmentStatus: async (id: string, status: string) => {
    const response = await api.put(`/appointments/${id}`, { status });
    return response.data;
  },
  deleteAppointment: async (id: string) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};

const chat = {
  getMessages: async (appointmentId: string) => {
    try {
      const response = await api.get(`/chat/messages/${appointmentId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get Messages API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
  },
  
  sendMessage: async (appointmentId: string, data: { message: string, type: string }) => {
    try {
      const response = await api.post('/chat/messages', {
        appointmentId,
        message: data.message,
        type: data.type
      });
      return response.data;
    } catch (error: any) {
      console.error('Send Message API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  },
  
  initiateCall: async (appointmentId: string, data: { callType: 'video' | 'voice', offer?: RTCSessionDescriptionInit }) => {
    try {
      const response = await api.post('/chat/call/initiate', {
        appointmentId,
        callType: data.callType,
        offer: data.offer
      });
      return response.data;
    } catch (error: any) {
      console.error('Initiate Call API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to initiate call');
    }
  },
  
  sendAnswer: async (appointmentId: string, data: { answer: RTCSessionDescriptionInit }) => {
    try {
      const response = await api.post('/chat/call/answer', {
        appointmentId,
        answer: data.answer
      });
      return response.data;
    } catch (error: any) {
      console.error('Send Answer API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to send answer');
    }
  },
  
  sendIceCandidate: async (appointmentId: string, data: { candidate: RTCIceCandidateInit }) => {
    try {
      const response = await api.post('/chat/call/ice-candidate', {
        appointmentId,
        candidate: data.candidate
      });
      return response.data;
    } catch (error: any) {
      console.error('Send ICE Candidate API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to send ICE candidate');
    }
  },
  
  endCall: async (appointmentId: string) => {
    try {
      const response = await api.post('/chat/call/end', { appointmentId });
      return response.data;
    } catch (error: any) {
      console.error('End Call API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to end call');
    }
  },
  
  getUnreadMessageCount: async () => {
    try {
      const response = await api.get('/chat/messages/unread/count');
      return response.data;
    } catch (error: any) {
      console.error('Get Unread Message Count API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch unread message count');
    }
  }
};

export default api;
export {
  auth,
  users,
  admin,
  services,
  appointments, 
  timeSlots,
  setAuthToken,
  chat,
};
