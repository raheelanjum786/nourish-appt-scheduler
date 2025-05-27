import React, { createContext, useContext, useState } from "react";
import apiService from "../services/api";
import { useAuth } from "./AuthContext";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface Appointment {
  _id: string;
  service: any;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
}

interface AppointmentContextType {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  fetchUserAppointments: () => Promise<void>;
  createAppointment: (appointmentData: any) => Promise<any>;
  cancelAppointment: (id: string) => Promise<void>;
  getAvailableTimeSlots: (
    date: string,
    serviceId?: string
  ) => Promise<TimeSlot[]>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchUserAppointments = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.appointments.getMyAppointments();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch appointments");
      console.error("Error fetching appointments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createAppointment = async (appointmentData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const newAppointment = await apiService.appointments.createAppointment(
        appointmentData
      );
      setAppointments((prev) => [...prev, newAppointment]);
      return newAppointment;
    } catch (err: any) {
      setError(err.message || "Failed to create appointment");
      console.error("Error creating appointment:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAppointment = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiService.appointments.cancelAppointment(id);
      // Update local state
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: "CANCELLED" }
            : appointment
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to cancel appointment");
      console.error("Error cancelling appointment:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableTimeSlots = async (
    date: string,
    serviceId?: string
  ): Promise<TimeSlot[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await apiService.appointments.getAvailableTimeSlots(
        date,
        serviceId
      );
    } catch (err: any) {
      setError(err.message || "Failed to get available time slots");
      console.error("Error getting time slots:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    appointments,
    isLoading,
    error,
    fetchUserAppointments,
    createAppointment,
    cancelAppointment,
    getAvailableTimeSlots,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

// Custom hook to use appointment context
export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error(
      "useAppointments must be used within an AppointmentProvider"
    );
  }
  return context;
};
