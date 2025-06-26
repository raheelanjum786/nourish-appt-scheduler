import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Trash,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { appointments } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const AdminAppointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointments.getAllAppointments();
        setAppointmentsList(data);
      } catch (err) {
        setError(err);
        toast({
          title: "Error",
          description: "Failed to fetch appointments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleAction = async (action, appointment) => {
    setSelectedAppointment(appointment);

    if (action === "view") {
      setIsEditing(false);
      setOpenDialog(true);
    } else if (action === "edit") {
      setIsEditing(true);
      setOpenDialog(true);
    } else if (action === "delete") {
      try {
        await appointments.deleteAppointment(appointment._id);
        setAppointmentsList(
          appointmentsList.filter((a) => a._id !== appointment._id)
        );
        toast({
          title: "Appointment Deleted",
          description: `Appointment for ${appointment.user?.name} has been deleted`,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete appointment",
          variant: "destructive",
        });
      }
    } else if (action === "complete") {
      try {
        await appointments.updateAppointmentStatus(
          appointment._id,
          "Completed"
        );
        setAppointmentsList(
          appointmentsList.map((a) =>
            a._id === appointment._id ? { ...a, status: "Completed" } : a
          )
        );
        toast({
          title: "Appointment Completed",
          description: `Appointment for ${appointment.user?.name} marked as completed`,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to complete appointment",
          variant: "destructive",
        });
      }
    } else if (action === "cancel") {
      try {
        await appointments.updateAppointmentStatus(
          appointment._id,
          "Cancelled"
        );
        setAppointmentsList(
          appointmentsList.map((a) =>
            a._id === appointment._id ? { ...a, status: "Cancelled" } : a
          )
        );
        toast({
          title: "Appointment Cancelled",
          description: `Appointment for ${appointment.user?.name} has been cancelled`,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to cancel appointment",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      await appointments.updateAppointmentStatus(
        selectedAppointment._id,
        selectedAppointment.status
      );
      setAppointmentsList(
        appointmentsList.map((a) =>
          a._id === selectedAppointment._id ? selectedAppointment : a
        )
      );
      toast({
        title: "Appointment Updated",
        description: `Appointment for ${selectedAppointment.user?.name} has been updated`,
      });
      setOpenDialog(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  if (error) {
    return <div>Error loading appointments: {error.message}</div>;
  }

  const filteredAppointments = appointmentsList.filter((appointment) => {
    const matchesSearch =
      appointment.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.user?.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.service?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending")
      return matchesSearch && appointment.status === "Pending";
    if (activeTab === "confirmed")
      return matchesSearch && appointment.status === "Confirmed";
    if (activeTab === "upcoming")
      return (
        matchesSearch &&
        (appointment.status === "Pending" || appointment.status === "Confirmed")
      );
    if (activeTab === "completed")
      return matchesSearch && appointment.status === "Completed";
    if (activeTab === "cancelled")
      return matchesSearch && appointment.status === "Cancelled";

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Appointments</h1>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Appointments</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments by client name, email or service..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{appointment.user?.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {appointment.user?.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{appointment.service?.name}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                {/* <TableCell>{appointment.time}</TableCell> */}
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      appointment.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "Upcoming"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleAction("view", appointment)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction("edit", appointment)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {appointment.status === "Upcoming" && (
                        <DropdownMenuItem
                          onClick={() => handleAction("complete", appointment)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Completed
                        </DropdownMenuItem>
                      )}
                      {appointment.status === "Upcoming" && (
                        <DropdownMenuItem
                          onClick={() => handleAction("cancel", appointment)}
                          className="text-red-600"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Appointment
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleAction("delete", appointment)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Appointment" : "Appointment Details"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to appointment information below."
                : "Appointment information and details."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Client
              </Label>
              <Input
                id="client"
                defaultValue={selectedAppointment?.user?.name || ""}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                defaultValue={selectedAppointment?.user?.email || ""}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Service
              </Label>
              {isEditing ? (
                <Select defaultValue={selectedAppointment?.service?.name || ""}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Video Consultation">
                      Video Consultation
                    </SelectItem>
                    <SelectItem value="Voice Call">Voice Call</SelectItem>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="service"
                  defaultValue={selectedAppointment?.service?.name || ""}
                  className="col-span-3"
                  readOnly
                />
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                defaultValue={selectedAppointment?.date || ""}
                className="col-span-3"
                type={isEditing ? "date" : "text"}
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                defaultValue={selectedAppointment?.time || ""}
                className="col-span-3"
                type={isEditing ? "time" : "text"}
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              {isEditing ? (
                <Select
                  defaultValue={selectedAppointment?.status || ""}
                  onValueChange={(value) => {
                    setSelectedAppointment({
                      ...selectedAppointment,
                      status: value,
                    });
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="status"
                  defaultValue={selectedAppointment?.status || ""}
                  className="col-span-3"
                  readOnly
                />
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <div className="col-span-3">
                <textarea
                  id="notes"
                  defaultValue={selectedAppointment?.notes || ""}
                  className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  readOnly={!isEditing}
                  onChange={(e) => {
                    if (isEditing) {
                      setSelectedAppointment({
                        ...selectedAppointment,
                        notes: e.target.value,
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            {isEditing ? (
              <Button type="submit" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            ) : (
              <Button type="button" onClick={() => setOpenDialog(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAppointments;
