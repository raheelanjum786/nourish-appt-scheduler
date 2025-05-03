
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ServiceModal from './ServiceModal';

interface ServiceType {
  id: string;
  title: string;
  description: string;
  image: string;
}

const servicesData: ServiceType[] = [
  {
    id: 'weight-management',
    title: 'Weight Management',
    description: 'Personalized plans for healthy weight loss, gain or maintenance with nutritional guidance.',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dietary-management',
    title: 'Dietary Management',
    description: 'Specialized diets for medical conditions, food allergies, and specific nutritional needs.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'body-contouring',
    title: 'Body Contouring',
    description: 'Nutrition and lifestyle plans designed to help shape and tone specific body areas.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  }
];

const Services = () => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceClick = (service: ServiceType) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-secondary mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive nutrition services tailored to your unique needs and goals. 
            Select any service to book an appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full btn-primary"
                  onClick={() => handleServiceClick(service)}
                >
                  Book Appointment
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {selectedService && (
          <ServiceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            service={selectedService}
          />
        )}
      </div>
    </section>
  );
};

export default Services;
