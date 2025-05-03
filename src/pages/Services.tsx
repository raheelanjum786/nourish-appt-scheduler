
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ServiceModal from "@/components/ServiceModal";

interface ServiceType {
  id: string;
  title: string;
  description: string;
  image: string;
}

const additionalServices: ServiceType[] = [
  {
    id: 'nutrition-counseling',
    title: 'Nutrition Counseling',
    description: 'One-on-one personalized nutrition guidance to improve your overall health and wellness.',
    image: 'https://images.unsplash.com/photo-1576765608866-5b51f8110791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'meal-planning',
    title: 'Meal Planning',
    description: 'Custom meal plans tailored to your dietary needs, preferences, and lifestyle.',
    image: 'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'specialized-diets',
    title: 'Specialized Diets',
    description: 'Expert guidance for specific dietary approaches like keto, plant-based, gluten-free, and more.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
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
              Discover our range of personalized nutrition services designed to help you achieve your health and wellness goals.
            </p>
          </div>
        </div>
        
        <Services />
        
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="heading-secondary text-center mb-10">Additional Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {additionalServices.map((service) => (
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
          </div>
        </section>
        
        <section className="section-padding bg-nutrition-green/10">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="heading-secondary mb-6">The Nutrition Journey Process</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-nutrition-primary text-white h-8 w-8 rounded-full flex items-center justify-center shrink-0">1</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Initial Consultation</h3>
                      <p className="text-gray-600">We'll discuss your health history, goals, and lifestyle to create a foundation for your personalized plan.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-nutrition-primary text-white h-8 w-8 rounded-full flex items-center justify-center shrink-0">2</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Personalized Plan Development</h3>
                      <p className="text-gray-600">Based on our consultation, I'll develop a customized nutrition plan tailored to your specific needs and preferences.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-nutrition-primary text-white h-8 w-8 rounded-full flex items-center justify-center shrink-0">3</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Implementation Support</h3>
                      <p className="text-gray-600">You'll receive guidance and resources to help you implement your plan successfully in your daily life.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-nutrition-primary text-white h-8 w-8 rounded-full flex items-center justify-center shrink-0">4</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Progress Monitoring</h3>
                      <p className="text-gray-600">Regular follow-up sessions to track your progress, make adjustments, and ensure you're moving toward your goals.</p>
                    </div>
                  </div>
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
