import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ServiceModal from "./ServiceModal";
import { useServices } from "@/context/ServiceContext";

interface ServiceCategoryType {
  _id: string;
  name: string;
  description: string;
  image: string;
}

const Services = () => {
  const { categories, isLoading, error, getServicesByCategory } = useServices();
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategoryType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCategoryClick = (category: ServiceCategoryType) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-secondary mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive nutrition services tailored to your unique needs and
            goals. Select any service to book an appointment.
          </p>
        </div>

        {isLoading && (
          <p className="text-center text-gray-500">
            Loading service categories...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500">
            Error loading service categories: {error}
          </p>
        )}
        {!isLoading && !error && categories.length === 0 && (
          <p className="text-center text-gray-500">
            No service categories available.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card
              key={category._id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {category.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full btn-primary"
                  onClick={() => handleCategoryClick(category)}
                >
                  View Services
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {selectedCategory && (
          <ServiceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            category={selectedCategory}
            getServicesByCategory={getServicesByCategory}
          />
        )}
      </div>
    </section>
  );
};

export default Services;
