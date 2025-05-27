import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesCategories from "@/components/Services"; // This now shows categories
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ServiceModal from "@/components/ServiceModal";
import { useServices } from "@/context/ServiceContext";

// Update the interface to match the backend Service structure
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

const ServicesPage = () => {
  const { services, isLoading, error } = useServices();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceClick = (service: ServiceType) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="py-8 md:py-12 bg-nutrition-primary/10">
          <div className="container-custom">
            <h1 className="heading-primary text-center mb-6">Our Services</h1>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Discover our range of personalized nutrition services designed to
              help you achieve your health and wellness goals.
            </p>
          </div>
        </div>

        {/* Service Categories Component */}
        <ServicesCategories />

        {/* Individual Services Section */}
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

        <section className="section-padding bg-nutrition-green/10">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="heading-secondary mb-6">
                  The Nutrition Journey Process
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-nutrition-primary text-white h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Initial Consultation
                      </h3>
                      <p className="text-gray-600">
                        We'll discuss your health history, goals, and lifestyle
                        to create a foundation for your personalized plan.
                      </p>
                    </div>
                  </div>
                  {/* Rest of the process steps remain unchanged */}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-64 h-64 bg-nutrition-peach/30 rounded-full z-0"></div>
                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Nutrition consultation process"
                  className="rounded-lg shadow-lg relative z-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Service Modal */}
        {selectedService && (
          <ServiceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            service={selectedService}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
