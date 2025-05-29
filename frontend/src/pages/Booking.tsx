import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../context/ServiceContext";
import { useAppointments } from "../context/AppointmentContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import PaymentModal from "@/components/PaymentModal";
import { Button } from "@/components/ui/button";
import { MessageSquare, Video, Phone } from "lucide-react";
import ChatModal from "@/components/ChatModal";

const BookingPage: React.FC = () => {
  const { services } = useServices();
  const { createAppointment } = useAppointments();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);

  // Add this useEffect to check for active appointments
  useEffect(() => {
    const checkActiveAppointments = async () => {
      try {
        const response = await api.appointments.getUserAppointments();
        const activeAppointments = response.data.filter(
          (appt: any) =>
            appt.status === "confirmed" || appt.status === "completed"
        );
        if (activeAppointments.length > 0) {
          setCurrentAppointment(activeAppointments[0]);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    checkActiveAppointments();
  }, []);

  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select a service, date, and time.",
        variant: "destructive",
      });
      return;
    }

    const appointmentData = {
      serviceId: selectedService,
      date: selectedDate,
      time: selectedTime,
      status: "pending",
    };

    setAppointmentDetails(appointmentData);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    toast({
      title: "Appointment Confirmed",
      description:
        "Your appointment has been successfully booked and paid for.",
    });
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="service">
            Select Service
          </label>
          <select
            id="service"
            className="w-full p-2 border rounded"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name} - ${service.price}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="date">
            Select Date
          </label>
          <input
            id="date"
            type="date"
            className="w-full p-2 border rounded"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="time">
            Select Time
          </label>
          <select
            id="time"
            className="w-full p-2 border rounded"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
          >
            <option value="">Select a time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Booking..." : "Book Appointment"}
        </button>
      </form>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        onBack={() => setShowPaymentModal(false)}
        amount={appointmentDetails?.service.price}
        description={`Appointment for ${selectedService} on ${selectedDate} at ${selectedTime}`}
        appointmentData={appointmentDetails}
      />

      {currentAppointment && (
        <div className="fixed bottom-6 right-6 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowChatModal(true)}
            className="rounded-full h-12 w-12"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => initiateCall("voice")}
            className="rounded-full h-12 w-12"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => initiateCall("video")}
            className="rounded-full h-12 w-12"
          >
            <Video className="h-5 w-5" />
          </Button>
        </div>
      )}

      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        appointmentId={currentAppointment?._id}
      />
    </div>
  );
};

export default BookingPage;
