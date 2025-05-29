import api from './api';

export const createPlanOrder = async (orderData: any) => {
  try {
    const response = await api.post('/api/plan-orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating plan order:', error);
    throw error;
  }
};

export const getUserPlanOrders = async (userId: string) => {
  try {
    const response = await api.get(`/api/plan-orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching plan orders for user ${userId}:`, error);
    throw error;
  }
};

export const getAllPlanOrders = async () => {
  try {
    const response = await api.get('/api/plan-orders/admin');
    return response.data;
  } catch (error) {
    console.error('Error fetching all plan orders:', error);
    throw error;
  }
};

export const getPlanOrderById = async (id: string) => {
  try {
    const response = await api.get(`/api/plan-orders/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching plan order with id ${id}:`, error);
    throw error;
  }
};

export const updatePlanOrder = async (id: string, orderData: any) => {
  try {
    const response = await api.put(`/api/plan-orders/admin/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error(`Error updating plan order with id ${id}:`, error);
    throw error;
  }
};

export const deletePlanOrder = async (id: string) => {
  try {
    const response = await api.delete(`/api/plan-orders/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting plan order with id ${id}:`, error);
    throw error;
  }
};