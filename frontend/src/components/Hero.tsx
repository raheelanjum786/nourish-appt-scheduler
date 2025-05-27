
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-nutrition-green/30 to-white">
      <div className="container-custom section-padding">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="heading-primary mb-4">
              Your Journey To A <span className="text-nutrition-primary">Healthier</span> Lifestyle Starts Here
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Personalized nutrition plans and expert guidance for your unique health goals. Transform your relationship with food and embrace a balanced lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-primary">Book Appointment</Button>
              <Button variant="outline" className="btn-outline">Learn More</Button>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-10">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-nutrition-peach rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-nutrition-green rounded-full opacity-50"></div>
              <img 
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Healthy nutrition"
                className="rounded-lg shadow-lg relative z-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
