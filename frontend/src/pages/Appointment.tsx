import React, { useEffect, useState } from "react";
import { useAppointments } from "@/context/AppointmentContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import ChatModal from "@/components/ChatModal";

interface Appointment {
  _id: string;
  service: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
}

const demoAppointments: Appointment[] = [
  {
    _id: "demo-1",
    service: "Consultation",
    date: "2023-10-27",
    startTime: "10:00",
    endTime: "11:00",
    status: "SCHEDULED",
    notes: "Discuss initial plan.",
  },
  {
    _id: "demo-2",
    service: "Follow-up",
    date: "2023-11-03",
    startTime: "14:00",
    endTime: "14:30",
    status: "COMPLETED",
  },
  {
    _id: "demo-3",
    service: "Therapy Session",
    date: "2023-11-10",
    startTime: "09:30",
    endTime: "10:30",
    status: "CANCELLED",
    notes: "Client requested reschedule.",
  },
];

const Appointment = () => {
  // const { appointments, isLoading, error, fetchUserAppointments } = // commented out
  //   useAppointments(); // commented out

  // Use demo data instead of context hook
  const appointments = demoAppointments;
  const isLoading = false; // Simulate not loading
  const error = null; // Simulate no error

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(
    () => {
      // fetchUserAppointments(); // commented out
      // Simulate fetching data by doing nothing or setting demo data if needed
    },
    [
      // fetchUserAppointments // commented out
    ]
  );

  const handleRowClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseDetails = () => {
    setSelectedAppointment(null);
  };

  const handleCancelAppointment = async (id: string) => {
    // await cancelAppointment(id); // commented out
    console.log(`Attempting to cancel appointment with ID: ${id}`); // Log instead of calling API
    handleCloseDetails();
    alert(
      "Cancel functionality not fully implemented in UI example (using demo data)."
    );
    // You might want to update the local state here to reflect the cancellation visually
    // For demo purposes, we'll just alert and close the dialog.
  };

  const handleOpenChat = () => {
    if (selectedAppointment) {
      setIsChatOpen(true);
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

      {appointments.length === 0 ? (
        <p>You have no upcoming appointments.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow
                key={appointment._id}
                onClick={() => handleRowClick(appointment)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <TableCell>{appointment.service}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>
                  {appointment.startTime} - {appointment.endTime}
                </TableCell>
                <TableCell>{appointment.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!selectedAppointment} onOpenChange={handleCloseDetails}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Details for your selected appointment.
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-1 font-semibold">Service:</div>
                <div className="col-span-3">{selectedAppointment.service}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-1 font-semibold">Date:</div>
                <div className="col-span-3">{selectedAppointment.date}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-1 font-semibold">Time:</div>
                <div className="col-span-3">
                  {selectedAppointment.startTime} -{" "}
                  {selectedAppointment.endTime}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-1 font-semibold">Status:</div>
                <div className="col-span-3">{selectedAppointment.status}</div>
              </div>
              {selectedAppointment.notes && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="col-span-1 font-semibold">Notes:</div>
                  <div className="col-span-3">{selectedAppointment.notes}</div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleOpenChat}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Chat with Provider
            </Button>
            <div>
              {selectedAppointment?.status === "SCHEDULED" && (
                <Button
                  variant="destructive"
                  onClick={() =>
                    handleCancelAppointment(selectedAppointment._id)
                  }
                  className="mr-2"
                >
                  Cancel Appointment
                </Button>
              )}
              <Button onClick={handleCloseDetails}>Close</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedAppointment && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={handleCloseChat}
          appointmentId={selectedAppointment._id}
        />
      )}
    </div>
  );
};

export default Appointment;
