import api from "./api";

export const getPlans = async () => {
  try {
    const response = await api.get('/plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error; 
  }
};

export const getPlanById = async (id: string) => {
  try {
    if (!id) {
      throw new Error('Plan ID is required');
    }
    
    const response = await api.get(`/api/plans/${id}`);
    
    if (response.data && response.data.status === 'success') {
      return response.data.data.plan;
    } else {
      return response.data; 
    }
  } catch (error) {
    console.error(`Error fetching plan with id ${id}:`, error);
    
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch plan');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw error;
    }
  }
};

export const createPlan = async (planData: any) => {
  try {
    const response = await api.post('/api/plans', planData);
    return response.data;
  } catch (error) {
    console.error('Error creating plan:', error);
    throw error;
  }
};

export const updatePlan = async (id: string, planData: any) => {
  try {
    const response = await api.put(`/api/plans/${id}`, planData);
    return response.data;
  } catch (error) {
    console.error(`Error updating plan with id ${id}:`, error);
    throw error;
  }
};

export const deletePlan = async (id: string) => {
  try {
    const response = await api.delete(`/api/plans/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting plan with id ${id}:`, error);
    throw error;
  }
};
// export const getUserPlans = async () => {
//   try {
//     const response = await api.get('/plans/user');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user plans:', error);
//     throw error;
//   }
// };
