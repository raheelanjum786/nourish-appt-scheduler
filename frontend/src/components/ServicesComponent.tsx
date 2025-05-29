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
import ConsultationTypeModal from "./ConsultationTypeModal"; // Import the new modal
import InvoiceDetailsModal from "./InvoiceDetailsModal"; // Import the new modal
import PaymentSection from "./PaymentSection"; // Import the PaymentSection component
import DateTimeSelectionModal from "./DateTimeSelectionModal"; // Import the new modal
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useToast } from "@/components/ui/use-toast"; // Import useToast

interface ServiceType {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  image?: string;
  isActive: boolean;
}

const Services = () => {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToBook, setServiceToBook] = useState<ServiceType | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false); // New state for consultation modal
  const [selectedConsultationType, setSelectedConsultationType] = useState(""); // New state for selected consultation type
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false); // New state for invoice modal
  const [isPaymentSectionOpen, setIsPaymentSectionOpen] = useState(false); // New state for payment section
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false); // New state for date/time modal
  const [selectedDate, setSelectedDate] = useState(""); // New state for selected date
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null); // New state for selected time slot
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false); // New state for user info modal
  const [userInfo, setUserInfo] = useState<any>(null); // New state for user info

  const { user } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate(); // Get navigate function
  const { toast } = useToast(); // Get toast function

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.services.getAll();
        setServices(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = (service: ServiceType) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleBookClick = (serviceId: string) => {
    const service = services.find((s) => s._id === serviceId);
    if (service) {
      setServiceToBook(service);
      setIsModalOpen(false);
      setIsDateTimeModalOpen(true); // Open DateTimeSelectionModal
    }
  };

  const handleSelectDateTime = (
    date: string,
    startTime: string,
    endTime: string
  ) => {
    setSelectedDate(date);
    setSelectedTimeSlot({ startTime, endTime });
    setIsDateTimeModalOpen(false);
    setIsUserInfoModalOpen(true); // Open UserInfoModal
  };

  const handleUserInfoSubmit = (info: any) => {
    setUserInfo(info);
    setIsUserInfoModalOpen(false);
    setIsPaymentSectionOpen(true); // Open PaymentSection directly after user info
  };

  const handleSelectConsultationType = (type: string) => {
    setSelectedConsultationType(type);
    setIsConsultationModalOpen(false);
    setIsInvoiceModalOpen(true); // Open InvoiceDetailsModal
  };

  const handleProceedToPayment = (
    serviceId: string,
    consultationType: string
  ) => {
    console.log(
      "Proceeding to payment for service:",
      serviceId,
      "with type:",
      consultationType
    );
    // TODO: Implement Stripe payment integration here
    setIsInvoiceModalOpen(false);
    setIsPaymentSectionOpen(true); // Open PaymentSection
  };

  const handlePaymentComplete = async (paymentIntentId: string) => {
    // Accept paymentIntentId
    console.log("Payment completed. Now save appointment.", paymentIntentId);
    if (!serviceToBook || !selectedDate || !selectedTimeSlot || !user) {
      toast({
        title: "Booking Error",
        description: "Missing information to save appointment.",
        variant: "destructive",
      });
      setIsPaymentSectionOpen(false);
      // Reset states
      setServiceToBook(null);
      setSelectedConsultationType("");
      setSelectedDate("");
      setSelectedTimeSlot(null);
      return;
    }

    try {
      await api.appointments.createAppointment({
        serviceId: serviceToBook._id,
        date: selectedDate,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        notes: `Consultation Type: ${selectedConsultationType}`, // Save consultation type in notes
        paymentIntentId: paymentIntentId, // Pass the payment intent ID
      });

      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully scheduled.",
      });

      // Reset states and navigate to dashboard
      setServiceToBook(null);
      setSelectedConsultationType("");
      setSelectedDate("");
      setSelectedTimeSlot(null);
      setIsPaymentSectionOpen(false);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving appointment:", error);
      toast({
        title: "Booking Failed",
        description:
          error.message ||
          "There was an error saving your appointment. Please try again.",
        variant: "destructive",
      });
      setIsPaymentSectionOpen(false);
      // Optionally keep the payment section open or go back to invoice if saving fails
    }
  };

  const handlePaymentBack = () => {
    setIsPaymentSectionOpen(false);
    setIsInvoiceModalOpen(true);
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
      </div>
    </section>

    // <section id="services" className="section-padding bg-gray-50">
    //   <div className="container-custom">
    //     <div className="text-center mb-12">
    //       <h2 className="heading-secondary mb-4">Our Services</h2>
    //       <p className="text-gray-600 max-w-2xl mx-auto">
    //         Comprehensive nutrition services tailored to your unique needs and
    //         goals. Select any service to book an appointment.
    //       </p>
    //     </div>

    //     {isLoading && (
    //       <p className="text-center text-gray-500">Loading services...</p>
    //     )}
    //     {error && (
    //       <p className="text-center text-red-500">
    //         Error loading services: {error}
    //       </p>
    //     )}
    //     {!isLoading && !error && services.length === 0 && (
    //       <p className="text-center text-gray-500">No services available.</p>
    //     )}

    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    //       {services.map((service) => (
    //         <Card
    //           key={service._id}
    //           className="overflow-hidden hover:shadow-lg transition-shadow"
    //         >
    //           <div className="h-48 overflow-hidden">
    //             <img
    //               src={
    //                 service.image ||
    //                 "https://via.placeholder.com/400x200?text=Service+Image"
    //               }
    //               alt={service.name}
    //               className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
    //             />
    //           </div>
    //           <CardHeader>
    //             <CardTitle>{service.name}</CardTitle>
    //           </CardHeader>
    //           <CardContent>
    //             <CardDescription className="text-gray-600">
    //               {service.description}
    //             </CardDescription>
    //           </CardContent>
    //           <CardFooter>
    //             <Button
    //               className="w-full btn-primary"
    //               onClick={() => handleServiceClick(service)}
    //               disabled={!service.isActive}
    //             >
    //               {service.isActive ? "View Details" : "Unavailable"}
    //             </Button>
    //           </CardFooter>
    //         </Card>
    //       ))}
    //     </div>

    //     {selectedService && (
    //       <ServiceModal
    //         isOpen={isModalOpen}
    //         onClose={() => setIsModalOpen(false)}
    //         service={selectedService}
    //         onBookClick={handleBookClick}
    //       />
    //     )}

    //     {serviceToBook && (
    //       <DateTimeSelectionModal
    //         isOpen={isDateTimeModalOpen}
    //         onClose={() => setIsDateTimeModalOpen(false)}
    //         onSelectDateTime={handleSelectDateTime}
    //         serviceId={serviceToBook._id}
    //       />
    //     )}

    //     {serviceToBook && selectedDate && selectedTimeSlot && (
    //       <UserInfoModal
    //         isOpen={isUserInfoModalOpen}
    //         onClose={() => setIsUserInfoModalOpen(false)}
    //         onNext={handleUserInfoSubmit}
    //         onBack={() => setIsDateTimeModalOpen(true)} // Go back to date/time selection
    //         serviceName={serviceToBook.name}
    //       />
    //     )
    //         onClose={() => setIsConsultationModalOpen(false)}
    //         onSelectType={handleSelectConsultationType}

    //         <InvoiceDetailsModal
    //           isOpen={isInvoiceModalOpen}
    //           onClose={() => setIsInvoiceModalOpen(false)}
    //           service={serviceToBook}
    //           consultationType={selectedConsultationType}
    //       selectedDate &&
    //       selectedTimeSlot &&
    //       userInfo &&
    //       isPaymentSectionOpen && (
    //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    //           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
    //             <PaymentSection
    //               amount={serviceToBook.price}
    //               serviceId={serviceToBook._id}
    //               consultationType={selectedConsultationType}
    //               onComplete={handlePaymentComplete}
    //               onBack={handlePaymentBack}
    //             />
    //           </div>
    //         </div>
    //       )}
    //   </div>
    // </section>
  );
};

export default Services;
