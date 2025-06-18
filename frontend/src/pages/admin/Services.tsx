
import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
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

// Service type definition
interface ServiceData {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  available: boolean;
  category?: string;
  createdAt?: string;
}

const AdminServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Load services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        // This would need to be implemented in adminService
        const response = await fetch('/api/services');
        const data = await response.json();
        
        // Transform data to match our interface
        const transformedServices = data.map((service: any) => ({
          ...service,
          available: service.available !== false, // Default to true if not specified
          price: parseFloat(service.price) || 0
        }));
        
        setServices(transformedServices);
        
        // Fetch service categories
        const categoriesData = await adminService.getServiceCategories();
        setCategories(categoriesData);
      } catch (error: any) {
        console.error('Error fetching services:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch services',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  // Filter services based on search term
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = async (action: string, service: ServiceData) => {
    setSelectedService(service);
    
    if (action === 'view') {
      setIsEditing(false);
      setOpenDialog(true);
    } else if (action === 'edit') {
      setIsEditing(true);
      setOpenDialog(true);
    } else if (action === 'delete') {
      try {
        await adminService.manageService(service.id, {}, 'DELETE');
        setServices(services.filter(s => s.id !== service.id));
        toast({
          title: "Service Deleted",
          description: `${service.name} has been deleted from the service list`,
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete service',
          variant: 'destructive'
        });
      }
    } else if (action === 'toggle') {
      try {
        const newStatus = !service.available;
        await adminService.manageService(service.id, { available: newStatus }, 'PUT');
        
        setServices(services.map(s => 
          s.id === service.id ? { ...s, available: newStatus } : s
        ));
        
        toast({
          title: `Service ${newStatus ? 'Activated' : 'Deactivated'}`,
          description: `${service.name} is now ${newStatus ? 'available' : 'unavailable'} for booking`,
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to update service status',
          variant: 'destructive'
        });
      }
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
