import api from './api';

export const getAvailableTimeSlots = async (date: string, serviceId?: string) => {
  return api.timeSlots.getAvailable(date, serviceId);
};

export const bookTimeSlot = async (timeSlotId: string, appointmentId: string) => {
  return api.timeSlots.book(timeSlotId, appointmentId);
};

export const releaseTimeSlot = async (timeSlotId: string) => {
  return api.timeSlots.release(timeSlotId);
};

export const getAllTimeSlots = async (filters?: { 
  date?: string, 
  status?: string, 
  service?: string 
}) => {
  return api.timeSlots.getAll(filters);
};