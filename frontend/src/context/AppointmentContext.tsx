import React, { createContext, useContext, useState } from "react";
import { appointments as appointmentsApi } from "@/services/api";
import { useAuth } from "./AuthContext";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface User {
  name: string;
  email: string;
}
interface Service {
  _id: string;
  name: string;
  duration: number;
  price: number;
}

interface Appointment {
  _id: string;
  service: Service;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  user: User;
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
      const data = await appointmentsApi.getUserAppointments();
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
      const newAppointment = await appointmentsApi.create(appointmentData);
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
      await appointmentsApi.cancelUserAppointment(id);
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
      return await appointmentsApi.getAvailableSlots(date, serviceId);
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

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error(
      "useAppointments must be used within an AppointmentProvider"
    );
  }
  return context;
};
