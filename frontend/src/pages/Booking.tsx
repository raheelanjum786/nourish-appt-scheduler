// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useServices } from "../context/ServiceContext";
// import { useAppointments } from "../context/AppointmentContext";
// import { useAuth } from "../context/AuthContext";
// import { useToast } from "@/components/ui/use-toast";
// import PaymentModal from "@/components/PaymentModal";
// import { Button } from "@/components/ui/button";
// import { MessageSquare, Video, Phone } from "lucide-react";
// import ChatModal from "@/components/ChatModal";
// // Import the api object
// import api from "@/services/api";

// const BookingPage: React.FC = () => {
//   const { services } = useServices();
//   // Destructure getAvailableTimeSlots from useAppointments
//   const { createAppointment, getAvailableTimeSlots } = useAppointments();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [selectedService, setSelectedService] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showChatModal, setShowChatModal] = useState(false);
//   const [currentAppointment, setCurrentAppointment] = useState<any>(null);
//   // Add state for available time slots
//   const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
//   // Add state for selected service details (to get price)
//   const [selectedServiceDetails, setSelectedServiceDetails] =
//     useState<any>(null);

//   // Add this useEffect to check for active appointments
//   useEffect(() => {
//     const checkActiveAppointments = async () => {
//       try {
//         // Use the imported api object
//         const response = await api.appointments.getUserAppointments();
//         const activeAppointments = response.data.filter(
//           (appt: any) =>
//             appt.status === "confirmed" || appt.status === "completed"
//         );
//         if (activeAppointments.length > 0) {
//           setCurrentAppointment(activeAppointments[0]);
//         }
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       }
//     };

//     checkActiveAppointments();
//   }, []);

//   // Add useEffect to fetch available time slots when date or service changes
//   useEffect(() => {
//     const fetchTimeSlots = async () => {
//       if (selectedDate && selectedService) {
//         try {
//           // Use the getAvailableTimeSlots function from context
//           const slots = await getAvailableTimeSlots(
//             selectedDate,
//             selectedService
//           );
//           // Assuming slots is an array of { startTime: string, endTime: string }
//           // Map to just the start time for the dropdown
//           setAvailableTimeSlots(slots.map((slot) => slot.startTime));
//           // Reset selected time if the current one is no longer available
//           if (!slots.find((slot) => slot.startTime === selectedTime)) {
//             setSelectedTime("");
//           }
//         } catch (error) {
//           console.error("Error fetching time slots:", error);
//           setAvailableTimeSlots([]);
//           setSelectedTime("");
//           toast({
//             title: "Error fetching slots",
//             description: "Could not retrieve available time slots.",
//             variant: "destructive",
//           });
//         }
//       } else {
//         setAvailableTimeSlots([]);
//         setSelectedTime("");
//       }
//     };

//     fetchTimeSlots();
//   }, [
//     selectedDate,
//     selectedService,
//     getAvailableTimeSlots,
//     selectedTime,
//     toast,
//   ]); // Add dependencies

//   const [appointmentDetails, setAppointmentDetails] = useState<any>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!selectedService || !selectedDate || !selectedTime) {
//       toast({
//         title: "Missing information",
//         description: "Please select a service, date, and time.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsSubmitting(true); // Start submitting state

//     try {
//       // Fetch service details to get the price
//       const serviceDetails = services.find((s) => s._id === selectedService);
//       if (!serviceDetails) {
//         toast({
//           title: "Error",
//           description: "Selected service not found.",
//           variant: "destructive",
//         });
//         setIsSubmitting(false);
//         return;
//       }
//       setSelectedServiceDetails(serviceDetails);

//       const appointmentData = {
//         serviceId: selectedService,
//         date: selectedDate,
//         time: selectedTime, // Assuming 'time' corresponds to 'startTime'
//         status: "pending", // Status before payment
//       };

//       setAppointmentDetails(appointmentData);
//       setShowPaymentModal(true);
//     } catch (error) {
//       console.error("Error preparing for payment:", error);
//       toast({
//         title: "Booking Error",
//         description: "Could not prepare for booking. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false); // End submitting state
//     }
//   };

//   const handlePaymentSuccess = async () => {
//     setShowPaymentModal(false);
//     setIsSubmitting(true); // Start submitting state for appointment creation

//     if (!appointmentDetails) {
//       toast({
//         title: "Error",
//         description: "Appointment details missing after payment.",
//         variant: "destructive",
//       });
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       // Call createAppointment from context after successful payment
//       const newAppointment = await createAppointment(appointmentDetails);

//       toast({
//         title: "Appointment Confirmed",
//         description:
//           "Your appointment has been successfully booked and paid for.",
//       });
//       // Optionally set the new appointment as current if needed for chat/call buttons
//       setCurrentAppointment(newAppointment);
//       navigate("/dashboard"); // Navigate after successful creation
//     } catch (error) {
//       console.error("Error creating appointment after payment:", error);
//       toast({
//         title: "Booking Error",
//         description:
//           "Payment successful, but failed to finalize appointment booking.",
//         variant: "destructive",
//       });
//       // Handle potential issues where payment succeeded but booking failed
//       // Maybe show a message to contact support or retry
//     } finally {
//       setIsSubmitting(false); // End submitting state
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>

//       <form
//         onSubmit={handleSubmit}
//         className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
//       >
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2" htmlFor="service">
//             Select Service
//           </label>
//           <select
//             id="service"
//             className="w-full p-2 border rounded"
//             value={selectedService}
//             onChange={(e) => setSelectedService(e.target.value)}
//             required
//           >
//             <option value="">Select a service</option>
//             {services.map((service) => (
//               <option key={service._id} value={service._id}>
//                 {service.name} - ${service.price}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2" htmlFor="date">
//             Select Date
//           </label>
//           <input
//             id="date"
//             type="date"
//             className="w-full p-2 border rounded"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             min={new Date().toISOString().split("T")[0]}
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block text-gray-700 mb-2" htmlFor="time">
//             Select Time
//           </label>
//           <select
//             id="time"
//             className="w-full p-2 border rounded"
//             value={selectedTime}
//             onChange={(e) => setSelectedTime(e.target.value)}
//             required
//             // Disable if no date or service is selected, or if no slots are available
//             disabled={
//               !selectedDate ||
//               !selectedService ||
//               availableTimeSlots.length === 0
//             }
//           >
//             <option value="">
//               {/* Update placeholder based on state */}
//               {!selectedDate || !selectedService
//                 ? "Select date and service first"
//                 : availableTimeSlots.length === 0
//                 ? "No slots available"
//                 : "Select a time"}
//             </option>
//             {/* Map over availableTimeSlots */}
//             {availableTimeSlots.map((time) => (
//               <option key={time} value={time}>
//                 {time}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition"
//           // Disable if submitting or if required fields are not selected
//           disabled={
//             isSubmitting || !selectedService || !selectedDate || !selectedTime
//           }
//         >
//           {isSubmitting ? "Processing..." : "Book Appointment"}
//         </button>
//       </form>

//       <PaymentModal
//         isOpen={showPaymentModal}
//         onClose={() => {
//           setShowPaymentModal(false);
//           setIsSubmitting(false); // Reset submitting state if modal is closed
//         }}
//         onPaymentSuccess={handlePaymentSuccess}
//         onBack={() => {
//           setShowPaymentModal(false);
//           setIsSubmitting(false); // Reset submitting state if modal is closed
//         }}
//         // Use the price from the fetched service details
//         amount={selectedServiceDetails?.price}
//         description={`Appointment for ${selectedServiceDetails?.name} on ${selectedDate} at ${selectedTime}`}
//         appointmentData={appointmentDetails} // Pass the prepared appointment data
//       />

//       {currentAppointment && (
//         <div className="fixed bottom-6 right-6 flex gap-2">
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => setShowChatModal(true)}
//             className="rounded-full h-12 w-12"
//           >
//             <MessageSquare className="h-5 w-5" />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => initiateCall("voice")}
//             className="rounded-full h-12 w-12"
//           >
//             <Phone className="h-5 w-5" />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => initiateCall("video")}
//             className="rounded-full h-12 w-12"
//           >
//             <Video className="h-5 w-5" />
//           </Button>
//         </div>
//       )}

//       <ChatModal
//         isOpen={showChatModal}
//         onClose={() => setShowChatModal(false)}
//         appointmentId={currentAppointment?._id}
//       />
//     </div>
//   );
// };

// export default BookingPage;
