
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
import { Search, MoreHorizontal, Plus, Edit, Trash, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

// Mock data
const servicesData = [
  { 
    id: 1, 
    name: "Video Consultation", 
    description: "One-on-one video counseling session with a certified therapist.", 
    duration: "60 minutes", 
    price: "$120", 
    available: true 
  },
  { 
    id: 2, 
    name: "Voice Call", 
    description: "Private phone consultation for those who prefer audio-only sessions.", 
    duration: "45 minutes", 
    price: "$90", 
    available: true 
  },
  { 
    id: 3, 
    name: "In-Person Session", 
    description: "Face-to-face counseling session in our comfortable office environment.", 
    duration: "60 minutes", 
    price: "$150", 
    available: true 
  },
  { 
    id: 4, 
    name: "Emergency Consultation", 
    description: "Urgent session available on short notice for crisis situations.", 
    duration: "30 minutes", 
    price: "$100", 
    available: true 
  },
  { 
    id: 5, 
    name: "Group Therapy", 
    description: "Facilitated discussion with a small group addressing common concerns.", 
    duration: "90 minutes", 
    price: "$80", 
    available: false 
  },
  { 
    id: 6, 
    name: "Family Counseling", 
    description: "Sessions designed to address family dynamics and improve communication.", 
    duration: "75 minutes", 
    price: "$180", 
    available: true 
  },
  { 
    id: 7, 
    name: "Couples Therapy", 
    description: "Focused sessions for partners to improve their relationship.", 
    duration: "90 minutes", 
    price: "$200", 
    available: true 
  },
  { 
    id: 8, 
    name: "Career Counseling", 
    description: "Guidance for career development, job satisfaction and work-life balance.", 
    duration: "60 minutes", 
    price: "$130", 
    available: false 
  }
];

const AdminServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Filter services based on search term
  const filteredServices = servicesData.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (action, service) => {
    setSelectedService(service);
    
    if (action === 'view') {
      setIsEditing(false);
      setOpenDialog(true);
    } else if (action === 'edit') {
      setIsEditing(true);
      setOpenDialog(true);
    } else if (action === 'delete') {
      toast({
        title: "Service Deleted",
        description: `${service.name} has been deleted from the service list`,
      });
    } else if (action === 'toggle') {
      const newStatus = !service.available;
      toast({
        title: `Service ${newStatus ? 'Activated' : 'Deactivated'}`,
        description: `${service.name} is now ${newStatus ? 'available' : 'unavailable'} for booking`,
      });
    }
  };

  const handleAddNewService = () => {
    setSelectedService(null);
    setIsEditing(true);
    setOpenDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <Button onClick={handleAddNewService}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services by name or description..."
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
              <TableHead>Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.duration}</TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      service.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {service.available ? 'Available' : 'Unavailable'}
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
                      <DropdownMenuItem onClick={() => handleAction('view', service)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('edit', service)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('toggle', service)}>
                        <Switch 
                          checked={service.available} 
                          className="mr-2"
                          onCheckedChange={() => handleAction('toggle', service)}
                        />
                        {service.available ? 'Set Unavailable' : 'Set Available'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('delete', service)} className="text-red-600">
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
              {isEditing ? (selectedService ? "Edit Service" : "Add New Service") : "Service Details"}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "Make changes to service information below." : "View service details."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue={selectedService?.name || ""}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="description"
                  defaultValue={selectedService?.description || ""}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Input
                id="duration"
                defaultValue={selectedService?.duration || ""}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                defaultValue={selectedService?.price || ""}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="available" className="text-right">
                Available
              </Label>
              <div className="flex items-center col-span-3">
                {isEditing ? (
                  <Switch 
                    id="available" 
                    defaultChecked={selectedService?.available} 
                    disabled={!isEditing}
                  />
                ) : (
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedService?.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {selectedService?.available ? 'Available' : 'Unavailable'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            {isEditing ? (
              <Button type="submit" onClick={() => {
                toast({
                  title: selectedService ? "Service Updated" : "Service Created",
                  description: selectedService 
                    ? `${selectedService.name} information has been updated` 
                    : "New service has been created",
                });
                setOpenDialog(false);
              }}>
                {selectedService ? "Save Changes" : "Create Service"}
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

export default AdminServices;
