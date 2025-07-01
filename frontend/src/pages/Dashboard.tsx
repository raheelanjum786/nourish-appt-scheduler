import React, { useEffect, useState } from "react";
import { useAppointments } from "../context/AppointmentContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Video, Phone } from "lucide-react";
import ChatModal from "@/components/ChatModal";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { appointments, fetchUserAppointments, cancelAppointment } =
    useAppointments();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      if (user?.id) {
        try {
          await fetchUserAppointments();
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load your appointments",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadAppointments();
  }, [user, fetchUserAppointments, toast]);

  const handleCancelAppointment = async (appointmentId: string) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(appointmentId);
        toast({
          title: "Appointment Cancelled",
          description: "Your appointment has been successfully cancelled.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to cancel the appointment",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <Link
          to="/booking"
          className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition"
        >
          Book New Appointment
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">My Appointments</h2>

        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading your appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              You don't have any appointments yet.
            </p>
            <Link
              to="/booking"
              className="mt-4 inline-block bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition"
            >
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appointment.service?.name || "Unknown Service"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(appointment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appointment.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                      {appointment.status === "confirmed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowChatModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                      )}
                      {appointment.status !== "cancelled" && (
                        <button
                          onClick={() =>
                            handleCancelAppointment(appointment.id)
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {selectedAppointment && (
        <ChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          appointmentId={selectedAppointment.id}
        />
      )}
    </div>
  );
};

export default DashboardPage;
