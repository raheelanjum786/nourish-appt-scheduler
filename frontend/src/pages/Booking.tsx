import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../context/ServiceContext";
import { useAppointments } from "../context/AppointmentContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

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

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
  }, []);

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

    setIsSubmitting(true);

    try {
      await createAppointment({
        userId: user?._id || "",
        serviceId: selectedService,
        date: selectedDate,
        time: selectedTime,
        status: "pending",
      });

      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully scheduled.",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Booking Failed",
        description:
          "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
    </div>
  );
};

export default BookingPage;
