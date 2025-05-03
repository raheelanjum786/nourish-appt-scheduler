
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceType {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceType;
}

const appointmentTypes = [
  {
    id: 'video-call',
    title: 'Video Call',
    description: 'Face-to-face consultation via video conferencing.',
    icon: '🎥',
  },
  {
    id: 'voice-call',
    title: 'Voice Call',
    description: 'Audio-only consultation over phone or internet.',
    icon: '📞',
  },
  {
    id: 'in-person',
    title: 'In-Person',
    description: 'Face-to-face consultation at our clinic.',
    icon: '🏥',
  }
];

const ServiceModal = ({ isOpen, onClose, service }: ServiceModalProps) => {
  const handleAppointmentTypeSelect = (appointmentTypeId: string) => {
    console.log(`Selected service: ${service.id}, appointment type: ${appointmentTypeId}`);
    // In a real application, this would navigate to the booking page or open another modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-nutrition-primary">
            Select Appointment Type
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to have your {service.title} consultation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {appointmentTypes.map((type) => (
            <Card 
              key={type.id}
              className="hover:border-nutrition-primary cursor-pointer transition-all"
              onClick={() => handleAppointmentTypeSelect(type.id)}
            >
              <CardHeader className="pb-2">
                <div className="text-3xl mb-2 text-center">{type.icon}</div>
                <CardTitle className="text-center">{type.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>{type.description}</CardDescription>
              </CardContent>
              <CardFooter className="pt-0 justify-center">
                <Button 
                  variant="outline"
                  className="w-full border-nutrition-primary text-nutrition-primary hover:bg-nutrition-primary hover:text-white"
                >
                  Select
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;
