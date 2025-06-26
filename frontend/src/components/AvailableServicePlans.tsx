import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServiceType {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  image?: string;
  category: string | { _id: string; name: string };
  isActive: boolean;
}

interface AvailableServicePlansProps {
  services: ServiceType[];
  isLoading: boolean;
  error: string | null;
  handleServiceClick: (service: ServiceType) => void;
}

const AvailableServicePlans: React.FC<AvailableServicePlansProps> = ({
  services,
  isLoading,
  error,
  handleServiceClick,
}) => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <h2 className="heading-secondary text-center mb-10">
          Available Service Plans
        </h2>
        {isLoading && (
          <p className="text-center text-gray-500">Loading services...</p>
        )}
        {error && (
          <p className="text-center text-red-500">
            Error loading services: {error}
          </p>
        )}
        {!isLoading && !error && services.length === 0 && (
          <p className="text-center text-gray-500">
            No services available.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!isLoading &&
            !error &&
            services.map((service) => (
              <Card
                key={service._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={
                      service.image ||
                      "https://via.placeholder.com/400x200?text=Service+Image"
                    }
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  {typeof service.category !== "string" && (
                    <p className="text-sm text-gray-500">
                      {service.category.name}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                  <div className="mt-2">
                    <p className="text-sm font-medium">
                      Duration: {service.duration} minutes
                    </p>
                    <p className="text-sm font-medium">
                      Price: ${service.price}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full btn-primary"
                    onClick={() => handleServiceClick(service)}
                    disabled={!service.isActive}
                  >
                    {service.isActive ? "Book Appointment" : "Unavailable"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
};

export default AvailableServicePlans;