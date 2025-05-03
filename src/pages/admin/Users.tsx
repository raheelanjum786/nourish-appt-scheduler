
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
import { Search, MoreHorizontal, Plus, User, Trash, Edit, Eye } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data
const usersData = [
  { id: 1, name: "Emma Thompson", email: "emma.t@example.com", role: "Client", status: "Active", lastLogin: "2023-05-01" },
  { id: 2, name: "Michael Chen", email: "michael.c@example.com", role: "Client", status: "Active", lastLogin: "2023-05-01" },
  { id: 3, name: "Sophia Williams", email: "sophia.w@example.com", role: "Client", status: "Inactive", lastLogin: "2023-04-25" },
  { id: 4, name: "James Johnson", email: "james.j@example.com", role: "Client", status: "Active", lastLogin: "2023-05-02" },
  { id: 5, name: "Olivia Brown", email: "olivia.b@example.com", role: "Admin", status: "Active", lastLogin: "2023-05-03" },
  { id: 6, name: "William Davis", email: "william.d@example.com", role: "Client", status: "Active", lastLogin: "2023-04-30" },
  { id: 7, name: "Ava Miller", email: "ava.m@example.com", role: "Client", status: "Blocked", lastLogin: "2023-04-22" },
  { id: 8, name: "Benjamin Wilson", email: "benjamin.w@example.com", role: "Client", status: "Active", lastLogin: "2023-05-02" },
  { id: 9, name: "Mia Moore", email: "mia.m@example.com", role: "Client", status: "Active", lastLogin: "2023-05-01" },
  { id: 10, name: "Samuel Taylor", email: "samuel.t@example.com", role: "Client", status: "Inactive", lastLogin: "2023-04-28" },
];

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Filter users based on search term
  const filteredUsers = usersData.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (action, user) => {
    setSelectedUser(user);
    
    if (action === 'view') {
      setIsEditing(false);
      setOpenDialog(true);
    } else if (action === 'edit') {
      setIsEditing(true);
      setOpenDialog(true);
    } else if (action === 'delete') {
      toast({
        title: "User Deleted",
        description: `${user.name} has been deleted`,
      });
    } else if (action === 'status') {
      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
      toast({
        title: "Status Updated",
        description: `${user.name}'s status changed to ${newStatus}`,
      });
    }
  };

  const handleAddNewUser = () => {
    setSelectedUser(null);
    setIsEditing(true);
    setOpenDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={handleAddNewUser}>
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
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
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : user.status === 'Inactive' 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleAction('view', user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('edit', user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('status', user)}>
                        <User className="mr-2 h-4 w-4" />
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('delete', user)} className="text-red-600">
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? (selectedUser ? "Edit User" : "Add New User") : "User Details"}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "Make changes to user information below." : "View user details."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue={selectedUser?.name || ""}
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
                defaultValue={selectedUser?.email || ""}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              {isEditing ? (
                <Select defaultValue={selectedUser?.role || "Client"}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Client">Client</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="role"
                  defaultValue={selectedUser?.role || ""}
                  className="col-span-3"
                  readOnly
                />
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              {isEditing ? (
                <Select defaultValue={selectedUser?.status || "Active"}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="status"
                  defaultValue={selectedUser?.status || ""}
                  className="col-span-3"
                  readOnly
                />
              )}
            </div>
          </div>
          <DialogFooter>
            {isEditing ? (
              <Button type="submit" onClick={() => {
                toast({
                  title: selectedUser ? "User Updated" : "User Created",
                  description: selectedUser 
                    ? `${selectedUser.name}'s information has been updated` 
                    : "New user has been created",
                });
                setOpenDialog(false);
              }}>
                {selectedUser ? "Save Changes" : "Create User"}
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

export default AdminUsers;
