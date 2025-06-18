import api from './api';

const adminService = {
  // Dashboard Statistics
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

  // User Management
  manageUser: async (id: string, data: any, method: 'PUT' | 'DELETE') => {
    try {
      if (method === 'PUT') {
        const response = await api.put(`/admin/users/${id}`, data);
        return response.data;
      } else {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
      }
    } catch (error: any) {
      console.error('Manage User API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to manage user');
    }
  },

  bulkManageUsers: async (users: string[], action: 'delete' | 'update', updates?: any) => {
    try {
      const payload = { users, action };
      if (updates) {
        payload['updates'] = updates;
      }
      const response = await api.post('/admin/users/bulk', payload);
      return response.data;
    } catch (error: any) {
      console.error('Bulk Manage Users API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to perform bulk user operation');
    }
  },

  // Service Management
  manageService: async (id: string, data: any, method: 'PUT' | 'DELETE') => {
    try {
      if (method === 'PUT') {
        const response = await api.put(`/admin/services/${id}`, data);
        return response.data;
      } else {
        const response = await api.delete(`/admin/services/${id}`);
        return response.data;
      }
    } catch (error: any) {
      console.error('Manage Service API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to manage service');
    }
  },

  getServiceCategories: async () => {
    try {
      const response = await api.get('/admin/service-categories');
      return response.data;
    } catch (error: any) {
      console.error('Get Service Categories API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch service categories');
    }
  },

  updateServiceCategories: async (categories: string[]) => {
    try {
      const response = await api.put('/admin/service-categories', { categories });
      return response.data;
    } catch (error: any) {
      console.error('Update Service Categories API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update service categories');
    }
  },

  // Appointment Management
  getFilteredAppointments: async (filters: { status?: string, dateRange?: string, serviceId?: string }) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.dateRange) params.append('dateRange', filters.dateRange);
      if (filters.serviceId) params.append('serviceId', filters.serviceId);
      
      const response = await api.get(`/admin/appointments/filter?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Get Filtered Appointments API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch filtered appointments');
    }
  },
  // Add these functions to your adminService.ts file
  
    approveAppointment: async (appointmentId: string, paymentDetails: any) => {
      try {
        const response = await api.put(`/admin/appointments/${appointmentId}/approve`, paymentDetails);
        return response.data;
      } catch (error: any) {
        console.error('Approve Appointment API error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to approve appointment');
      }
    },
  
    approvePlanOrder: async (orderId: string, paymentDetails: any) => {
      try {
        const response = await api.put(`/admin/plan-orders/${orderId}/approve`, paymentDetails);
        return response.data;
      } catch (error: any) {
        console.error('Approve Plan Order API error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to approve plan order');
      }
    },
};

export default adminService;