
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { Search, MoreHorizontal, Plus, User, Trash, Edit, Eye, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// User type definition
interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'PROVIDER' | 'CLIENT';
  status?: 'Active' | 'Inactive' | 'Blocked';
  lastLogin?: string;
  createdAt: string;
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'CLIENT',
    password: '',
    status: 'Active'
  });
  const { toast } = useToast();

  // Load users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/users`);
        // Transform data to include status (which might not be in our DB but is in our UI)
        const transformedUsers = response.data.map((user: any) => ({
          ...user,
          status: 'Active', // Default status since our backend might not have this
          lastLogin: user.lastLogin || user.updatedAt
        }));
        setUsers(transformedUsers);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to fetch users',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = async (action: string, user: UserData) => {
    setSelectedUser(user);
    
    if (action === 'view') {
      setIsEditing(false);
      setOpenDialog(true);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        status: user.status || 'Active'
      });
    } else if (action === 'edit') {
      setIsEditing(true);
      setOpenDialog(true);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        status: user.status || 'Active'
      });
    } else if (action === 'delete') {
      try {
        await axios.delete(`${API_URL}/users/${user.id}`);
        setUsers(users.filter(u => u.id !== user.id));
        toast({
          title: "User Deleted",
          description: `${user.name} has been deleted`,
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to delete user',
          variant: 'destructive'
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNewUser = () => {
    setSelectedUser(null);
    setIsEditing(true);
    setOpenDialog(true);
    setFormData({
      name: '',
      email: '',
      role: 'CLIENT',
      password: '',
      status: 'Active'
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedUser) {
        // Update existing user
        const { password, status, ...updateData } = formData;
        const response = await axios.put(`${API_URL}/users/${selectedUser.id}`, updateData);
        
        setUsers(users.map(user => 
          user.id === selectedUser.id ? { ...response.data, status } : user
        ));
        
        toast({
          title: "User Updated",
          description: `${formData.name}'s information has been updated`,
        });
      } else {
        // Create new user
        const response = await axios.post(`${API_URL}/auth/register`, formData);
        setUsers([...users, { 
          ...response.data.user,
          status: formData.status, 
          lastLogin: new Date().toISOString() 
        }]);
        
        toast({
          title: "User Created",
          description: "New user has been created",
        });
      }
      setOpenDialog(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save user',
        variant: 'destructive'
      });
    }
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
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
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
                        {user.status || 'Active'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleAction('delete', user)} className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
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
                value={formData.name}
                onChange={handleInputChange}
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
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
                readOnly={!isEditing}
              />
            </div>
            {isEditing && !selectedUser && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              {isEditing ? (
                <Select 
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="PROVIDER">Provider</SelectItem>
                    <SelectItem value="CLIENT">Client</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="role"
                  value={formData.role}
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
                <Select 
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
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
                  value={formData.status}
                  className="col-span-3"
                  readOnly
                />
              )}
            </div>
          </div>
          <DialogFooter>
            {isEditing ? (
              <Button type="submit" onClick={handleSubmit}>
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
