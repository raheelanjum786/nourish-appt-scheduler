import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/api";

interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  image?: string;
  isActive: boolean;
}

interface ServiceContextType {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  getServiceById: (id: string) => Service | undefined;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.services.getAll();
      setServices(data);
    } catch (err) {
      setError(err.message || "Failed to fetch services");
      console.error("Error fetching services:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const getServiceById = (id: string) => {
    return services.find((service) => service._id === id);
  };

  const value = {
    services,
    isLoading,
    error,
    fetchServices,
    getServiceById,
  };

  return (
    <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>
  );
};

// Custom hook to use service context
export const useServices = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
};
