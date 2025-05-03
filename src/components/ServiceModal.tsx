
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DateTimeSelector from "./DateTimeSelector";
import UserInfoForm, { UserInfo } from "./UserInfoForm";
import AppointmentSummary from "./AppointmentSummary";
import PaymentSection from "./PaymentSection";
import ChatInterface from "./ChatInterface";

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

// Modal steps
type ModalStep = 
  | 'appointment-type' 
  | 'date-time' 
  | 'user-info' 
  | 'summary'
  | 'payment'
  | 'chat';

const ServiceModal = ({ isOpen, onClose, service }: ServiceModalProps) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>('appointment-type');
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const resetModal = () => {
    setCurrentStep('appointment-type');
    setSelectedAppointmentType(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setUserInfo(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleAppointmentTypeSelect = (appointmentTypeId: string) => {
    setSelectedAppointmentType(appointmentTypeId);
    setCurrentStep('date-time');
  };

  const handleDateTimeSelected = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setCurrentStep('user-info');
  };

  const handleUserInfoSubmitted = (info: UserInfo) => {
    setUserInfo(info);
    setCurrentStep('summary');
  };

  const handleConfirmAppointment = () => {
    setCurrentStep('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentStep('chat');
  };

  const getAppointmentTypeName = () => {
    if (!selectedAppointmentType) return "";
    const appointmentType = appointmentTypes.find(type => type.id === selectedAppointmentType);
    return appointmentType ? appointmentType.title : "";
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'appointment-type':
        return (
          <>
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
          </>
        );
        
      case 'date-time':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-nutrition-primary">
                Select Date & Time
              </DialogTitle>
              <DialogDescription>
                Choose a date and time for your {getAppointmentTypeName()} appointment.
              </DialogDescription>
            </DialogHeader>
            
            <DateTimeSelector 
              onNext={handleDateTimeSelected}
              onBack={() => setCurrentStep('appointment-type')}
            />
          </>
        );
        
      case 'user-info':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-nutrition-primary">
                Personal Information
              </DialogTitle>
              <DialogDescription>
                Please provide your details for the appointment.
              </DialogDescription>
            </DialogHeader>
            
            <UserInfoForm 
              onNext={handleUserInfoSubmitted}
              onBack={() => setCurrentStep('date-time')}
              serviceName={service.title}
            />
          </>
        );
        
      case 'summary':
        if (!selectedDate || !selectedTime || !userInfo || !selectedAppointmentType) {
          return null;
        }
        
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-nutrition-primary">
                Review Your Appointment
              </DialogTitle>
              <DialogDescription>
                Please confirm your appointment details before proceeding to payment.
              </DialogDescription>
            </DialogHeader>
            
            <AppointmentSummary
              userInfo={userInfo}
              appointmentDate={selectedDate}
              appointmentTime={selectedTime}
              serviceName={service.title}
              appointmentType={getAppointmentTypeName()}
              onConfirm={handleConfirmAppointment}
              onBack={() => setCurrentStep('user-info')}
            />
          </>
        );
        
      case 'payment':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-nutrition-primary">
                Payment
              </DialogTitle>
              <DialogDescription>
                Complete your payment to confirm your appointment.
              </DialogDescription>
            </DialogHeader>
            
            <PaymentSection
              onComplete={handlePaymentComplete}
              onBack={() => setCurrentStep('summary')}
              amount={75}
            />
          </>
        );
        
      case 'chat':
        return userInfo ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-nutrition-primary">
                Your Appointment Chat
              </DialogTitle>
              <DialogDescription>
                You can now chat with your nutritionist before and after your appointment.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <ChatInterface 
                userName={userInfo.name}
                userEmail={userInfo.email}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleClose}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </>
        ) : null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`${currentStep === 'chat' ? 'sm:max-w-[800px]' : 'sm:max-w-[600px]'}`}>
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;
