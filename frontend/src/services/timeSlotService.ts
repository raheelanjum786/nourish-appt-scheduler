import { timeSlots } from './api';

export const getAvailableTimeSlots = async (date: string, serviceId?: string) => {
  return timeSlots.getAvailable(date, serviceId);
};

export const bookTimeSlot = async (timeSlotId: string, appointmentId: string) => {
  return timeSlots.book(timeSlotId, appointmentId);
};

export const releaseTimeSlot = async (timeSlotId: string) => {
  return timeSlots.release(timeSlotId);
};

export const getAllTimeSlots = async (filters?: { 
  date?: string, 
  status?: string, 
  service?: string 
}) => {
  return timeSlots.getAll(filters);
};