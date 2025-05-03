
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Calendar, Trash, Edit, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data
const appointmentsData = [
  { id: 1, user: "Emma Thompson", email: "emma.t@example.com", service: "Video Consultation", date: "2023-05-03", time: "10:00 AM", status: "Completed", notes: "Follow-up in 2 weeks" },
  { id: 2, user: "Michael Chen", email: "michael.c@example.com", service: "Voice Call", date: "2023-05-03", time: "11:30 AM", status: "Upcoming", notes: "First consultation" },
  { id: 3, user: "Sophia Williams", email: "sophia.w@example.com", service: "In-Person", date: "2023-05-04", time: "2:00 PM", status: "Upcoming", notes: "Anxiety management" },
  { id: 4, user: "James Johnson", email: "james.j@example.com", service: "Video Consultation", date: "2023-05-05", time: "9:00 AM", status: "Upcoming", notes: "" },
  { id: 5, user: "Olivia Brown", email: "olivia.b@example.com", service: "Voice Call", date: "2023-05-06", time: "3:30 PM", status: "Upcoming", notes: "Career counseling" },
  { id: 6, user: "William Davis", email: "william.d@example.com", service: "Video Consultation", date: "2023-05-01", time: "1:00 PM", status: "Completed", notes: "Stress management" },
  { id: 7, user: "Ava Miller", email: "ava.m@example.com", service: "In-Person", date: "2023-05-02", time: "11:00 AM", status: "Cancelled", notes: "Client canceled" },
  { id: 8, user: "Benjamin Wilson", email: "benjamin.w@example.com", service: "Voice Call", date: "2023-05-02", time: "4:00 PM", status: "Completed", notes: "" },
  { id: 9, user: "Mia Moore", email: "mia.m@example.com", service: "Video Consultation", date: "2023-05-01", time: "9:30 AM", status: "Completed", notes: "Relationship counseling" },
  { id: 10, user: "Samuel Taylor", email: "samuel.t@example.com", service: "In-Person", date: "2023-05-07", time: "10:30 AM", status: "Upcoming", notes: "First appointment" },
];

const AdminAppointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Filter appointments based on search term and active tab
  const filteredAppointments = appointmentsData.filter(appointment => {
    const matchesSearch = 
      appointment.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "upcoming") return matchesSearch && appointment.status === "Upcoming";
    if (activeTab === "completed") return matchesSearch && appointment.status === "Completed";
    if (activeTab === "cancelled") return matchesSearch && appointment.status === "Cancelled";
    
    return matchesSearch;
  });

  const handleAction = (action, appointment) => {
    setSelectedAppointment(appointment);
    
    if (action === 'view') {
      setIsEditing(false);
      setOpenDialog(true);
    } else if (action === 'edit') {
      setIsEditing(true);
      setOpenDialog(true);
    } else if (action === 'delete') {
      toast({
        title: "Appointment Cancelled",
        description: `Appointment for ${appointment.user} has been cancelled`,
      });
    } else if (action === 'complete') {
      toast({
        title: "Appointment Completed",
        description: `Appointment for ${appointment.user} marked as completed`,
      });
    } else if (action === 'cancel') {
      toast({
        title: "Appointment Cancelled",
        description: `Appointment for ${appointment.user} has been cancelled`,
      });
    }
  };

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
              <TableRow key={appointment.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{appointment.user}</div>
                    <div className="text-xs text-muted-foreground">{appointment.email}</div>
                  </div>
                </TableCell>
                <TableCell>{appointment.service}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      appointment.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : appointment.status === 'Upcoming' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-red-100 text-red-800'
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
                      <DropdownMenuItem onClick={() => handleAction('view', appointment)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('edit', appointment)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {appointment.status === 'Upcoming' && (
                        <DropdownMenuItem onClick={() => handleAction('complete', appointment)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Completed
                        </DropdownMenuItem>
                      )}
                      {appointment.status === 'Upcoming' && (
                        <DropdownMenuItem onClick={() => handleAction('cancel', appointment)} className="text-red-600">
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Appointment
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleAction('delete', appointment)} className="text-red-600">
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
              {isEditing ? "Make changes to appointment information below." : "Appointment information and details."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Client
              </Label>
              <Input
                id="client"
                defaultValue={selectedAppointment?.user || ""}
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
                defaultValue={selectedAppointment?.email || ""}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Service
              </Label>
              {isEditing ? (
                <Select defaultValue={selectedAppointment?.service || ""}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Video Consultation">Video Consultation</SelectItem>
                    <SelectItem value="Voice Call">Voice Call</SelectItem>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="service"
                  defaultValue={selectedAppointment?.service || ""}
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
                <Select defaultValue={selectedAppointment?.status || ""}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
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
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            {isEditing ? (
              <Button type="submit" onClick={() => {
                toast({
                  title: "Appointment Updated",
                  description: `Appointment for ${selectedAppointment.user} has been updated`,
                });
                setOpenDialog(false);
              }}>
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
