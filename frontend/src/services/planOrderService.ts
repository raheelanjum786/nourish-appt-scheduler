import api from './api';

export const createPlanOrder = async (orderData: any) => {
  try {
    // Remove the extra /api prefix
    const response = await api.post('/plan-orders', orderData);

    return response.data;
  } catch (error) {
    console.error('Error creating plan order:', error);
    throw error;
  }
};

export const getUserPlanOrders = async (userId: string) => {
  try {
    // Remove the extra /api prefix
    const response = await api.get(`/plan-orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching plan orders for user ${userId}:`, error);
    throw error;
  }
};

export const getAllPlanOrders = async () => {
  try {
    const response = await api.get('/plan-orders/admin');
    return response.data;
  } catch (error) {
    console.error('Error fetching all plan orders:', error);
    throw error;
  }
};

export const getPlanOrderById = async (id: string) => {
  try {
    const response = await api.get(`/plan-orders/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching plan order with id ${id}:`, error);
    throw error;
  }
};

export const updatePlanOrder = async (id: string, orderData: any) => {
  try {
    const response = await api.put(`/plan-orders/admin/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error(`Error updating plan order with id ${id}:`, error);
    throw error;
  }
};

export const deletePlanOrder = async (id: string) => {
  try {
    const response = await api.delete(`/plan-orders/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting plan order with id ${id}:`, error);
    throw error;
  }
};

// Add this new function to fetch the payment intent client secret
export const getPaymentIntentClientSecret = async (orderId: string) => {
  try {
    // Assuming your backend has an endpoint like /api/plan-orders/:orderId/payment-intent
    const response = await api.post(`/plan-orders/${orderId}/payment-intent`);
    return response.data.clientSecret; // This function already returns the clientSecret string
  } catch (error) {
    console.error(`Error fetching payment intent for order ${orderId}:`, error);
    throw error;
  }
};