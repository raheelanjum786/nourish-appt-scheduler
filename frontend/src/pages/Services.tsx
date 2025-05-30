import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesCategories from "@/components/ServicesComponent";
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
import ConsultationTypeModal from "@/components/ConsultationTypeModal";
import DateTimeSelectionModal from "@/components/DateTimeSelectionModal";
import InvoiceDetailsModal from "@/components/InvoiceDetailsModal";
import ServiceType from "@/components/InvoiceDetailsModal";
import PaymentModal from "@/components/PaymentModal";
import UserInfoModal from "@/components/UserInfoModal";
import { UserInfo } from "@/components/UserInfoForm";
import { useServices } from "@/context/ServiceContext";
import api from "@/services/api";

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
  // const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  // const [isConsultationTypeModalOpen, setIsConsultationTypeModalOpen] =
  //   useState(false);
  // const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false);
  // const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  // const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  // const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { services, isLoading, error } = useServices();

  const [currentStep, setCurrentStep] = useState(0); // 0: closed, 1:
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null
  );
  const [selectedConsultationType, setSelectedConsultationType] =
    useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  const handleConsultationTypeSelect = (type: string) => {
    setSelectedConsultationType(type);
    setCurrentStep(3);
  };

  const handleDateTimeSelect = (
    date: string,
    timeSlot: { startTime: string; endTime: string }
  ) => {
    setSelectedDate(date);
    setSelectedTimeSlot(timeSlot);
    setCurrentStep(4);
  };

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setCurrentStep(5);
  };

  const handleInvoiceConfirm = async () => {
    if (!selectedService || !selectedDate || !selectedTimeSlot || !userInfo) {
      console.error("Missing required appointment details");
      alert("Please fill in all appointment details");
      return;
    }

    try {
      const appointmentData = {
        serviceId: selectedService._id,
        consultationType: selectedConsultationType,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        userInfo: userInfo,
      };

      console.log("Appointment data ready:", appointmentData);

      setCurrentStep(6);

      // If you need to actually create the appointment first:
      // const response = await api.appointments.create(appointmentData);
      // console.log("Appointment created successfully:", response);
      setCurrentStep(6);
    } catch (error) {
      console.error("Error preparing appointment:", error);
      alert("Failed to prepare appointment. Please try again.");
    }
  };

  const handlePaymentSuccess = () => {
    console.log("Payment successful!");
    handleCloseModals();
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCloseModals = () => {
    setCurrentStep(0);
    setSelectedService(null);
    setSelectedConsultationType("");
    setSelectedDate("");
    setSelectedTimeSlot(null);
    setUserInfo(null); // Clear user info
  };

  const handleServiceClick = (service: ServiceType) => {
    setSelectedService(service);
    setCurrentStep(1); // Open Service Modal
  };

  const handleAppointmentSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTimeSlot || !userInfo) {
      toast({
        title: "Error",
        description: "Please fill in all appointment details",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await api.post("/api/appointments", {
        serviceId: selectedService._id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        userInfo,
        consultationType: selectedConsultationType,
      });

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      });

      // Redirect to confirmation page or update state
      setCurrentStep(6);
      setAppointmentDetails(response.data);
    } catch (error: any) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to book appointment",
        variant: "destructive",
      });
    }
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

        {/* <ServicesCategories /> */}

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
      </main>
      <Footer />

      {/* Modals */}
      <ServiceModal
        isOpen={currentStep === 1}
        onClose={handleCloseModals}
        service={selectedService}
        onNext={handleServiceSelect}
      />

      <ConsultationTypeModal
        isOpen={currentStep === 2}
        onClose={handleCloseModals}
        onNext={handleConsultationTypeSelect}
        onBack={handleBack}
      />

      <DateTimeSelectionModal
        isOpen={currentStep === 3}
        onClose={handleCloseModals}
        onNext={handleDateTimeSelect}
        onBack={handleBack}
        serviceId={selectedService?._id}
      />

      <UserInfoModal
        isOpen={currentStep === 4}
        onClose={handleCloseModals}
        onNext={handleUserInfoSubmit}
        onBack={handleBack}
        serviceName={selectedService?.name}
      />

      <InvoiceDetailsModal
        isOpen={currentStep === 5}
        onClose={handleCloseModals}
        onNext={handleInvoiceConfirm}
        onBack={handleBack}
        service={selectedService}
        consultationType={selectedConsultationType}
        date={selectedDate}
        timeSlot={selectedTimeSlot}
        userInfo={userInfo}
      />

      <PaymentModal
        isOpen={currentStep === 6}
        onClose={handleCloseModals}
        onPaymentSuccess={handlePaymentSuccess}
        onBack={() => setCurrentStep(5)}
        amount={selectedService?.price || 0}
        description={`Appointment for ${selectedService?.name || "service"}`}
      />
    </div>
  );
};

export default ServicesPage;
