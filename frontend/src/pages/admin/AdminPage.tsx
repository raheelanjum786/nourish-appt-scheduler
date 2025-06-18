import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
  Settings,
  FileText,
  LogOut,
} from "lucide-react";
import AdminUsers from "./Users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

import api from "@/services/api";
import { admin } from "@/services/api";

const statsData = [
  {
    title: "Total Users",
    value: "342",
    change: "+12%",
    icon: Users,
    trend: "up",
  },
  {
    title: "Active Appointments",
    value: "24",
    change: "+18%",
    icon: Calendar,
    trend: "up",
  },
  {
    title: "New Messages",
    value: "16",
    change: "-5%",
    icon: MessageSquare,
    trend: "down",
  },
];

const recentAppointments = [
  {
    id: 1,
    user: "Emma Thompson",
    service: "Video Consultation",
    date: "2023-05-03",
    time: "10:00 AM",
    status: "Completed",
  },
  {
    id: 2,
    user: "Michael Chen",
    service: "Voice Call",
    date: "2023-05-03",
    time: "11:30 AM",
    status: "Upcoming",
  },
  {
    id: 3,
    user: "Sophia Williams",
    service: "In-Person",
    date: "2023-05-04",
    time: "2:00 PM",
    status: "Upcoming",
  },
  {
    id: 4,
    user: "James Johnson",
    service: "Video Consultation",
    date: "2023-05-05",
    time: "9:00 AM",
    status: "Upcoming",
  },
  {
    id: 5,
    user: "Olivia Brown",
    service: "Voice Call",
    date: "2023-05-06",
    time: "3:30 PM",
    status: "Upcoming",
  },
];

const recentUsers = [
  {
    id: 1,
    name: "Emma Thompson",
    email: "emma.t@example.com",
    joinedDate: "2023-05-01",
    appointmentsCount: 3,
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.c@example.com",
    joinedDate: "2023-05-01",
    appointmentsCount: 1,
  },
  {
    id: 3,
    name: "Sophia Williams",
    email: "sophia.w@example.com",
    joinedDate: "2023-05-02",
    appointmentsCount: 2,
  },
  {
    id: 4,
    name: "James Johnson",
    email: "james.j@example.com",
    joinedDate: "2023-05-02",
    appointmentsCount: 1,
  },
  {
    id: 5,
    name: "Olivia Brown",
    email: "olivia.b@example.com",
    joinedDate: "2023-05-03",
    appointmentsCount: 0,
  },
];

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  // State to hold dashboard stats
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);

  // State to hold recent appointments
  const [recentAppointmentsData, setRecentAppointmentsData] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [errorAppointments, setErrorAppointments] = useState(null);

  // State to hold recent users
  const [recentUsersData, setRecentUsersData] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);

  // Fetch dashboard stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await admin?.getDashboardStats();
        setDashboardStats(stats);
      } catch (err: any) {
        setErrorStats(err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecentAppointments = async () => {
      try {
        const appointments = await admin?.getRecentAppointments();
        setRecentAppointmentsData(appointments);
      } catch (err: any) {
        setErrorAppointments(err);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchRecentAppointments();
  }, []);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const users = await admin?.getRecentUsers();
        setRecentUsersData(users);
      } catch (err: any) {
        setErrorUsers(err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchRecentUsers();
  }, []);

  if (loadingStats || loadingAppointments || loadingUsers) {
    return <div>Loading Dashboard...</div>;
  }

  if (errorStats) {
    return <div>Error loading stats: {errorStats.message}</div>;
  }

  if (errorAppointments) {
    return (
      <div>Error loading recent appointments: {errorAppointments.message}</div>
    );
  }

  if (errorUsers) {
    return <div>Error loading recent users: {errorUsers.message}</div>;
  }

  const displayStats =
    Array.isArray(dashboardStats) && dashboardStats.length > 0
      ? dashboardStats
      : statsData;
  const displayRecentAppointments =
    recentAppointmentsData.length > 0
      ? recentAppointmentsData
      : recentAppointments;
  const displayRecentUsers =
    recentUsersData.length > 0 ? recentUsersData : recentUsers;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-muted/10">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-lg font-semibold text-primary-foreground">
                AC
              </div>
              <div>
                <div className="text-lg font-semibold">Admin Console</div>
                <div className="text-xs text-muted-foreground">
                  {user?.name || "Admin User"}
                </div>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Dashboard">
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        isActive ? "data-[active=true]" : ""
                      }
                      end
                    >
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Users">
                    <NavLink
                      to="/admin/users"
                      className={({ isActive }) =>
                        isActive ? "data-[active=true]" : ""
                      }
                    >
                      <Users />
                      <span>Users</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Appointments">
                    <NavLink
                      to="/admin/appointments"
                      className={({ isActive }) =>
                        isActive ? "data-[active=true]" : ""
                      }
                    >
                      <Calendar />
                      <span>Appointments</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Services">
                    <NavLink
                      to="/admin/services"
                      className={({ isActive }) =>
                        isActive ? "data-[active=true]" : ""
                      }
                    >
                      <FileText />
                      <span>Services</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Messages">
                    <NavLink
                      to="/admin/messages"
                      className={({ isActive }) =>
                        isActive ? "data-[active=true]" : ""
                      }
                    >
                      <MessageSquare />
                      <span>Messages</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <NavLink
                      to="/admin/settings"
                      className={({ isActive }) =>
                        isActive ? "data-[active=true]" : ""
                      }
                    >
                      <Settings />
                      <span>Settings</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <SidebarTrigger className="lg:hidden" />
            </div>
          </div>
          {/* Dashboard Content */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
              {displayStats.map((stat, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <div className="flex items-center">
                          <h3 className="text-2xl font-bold">{stat.value}</h3>
                          <span
                            className={`ml-2 flex items-center text-xs ${
                              stat.trend === "up"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {stat.change}
                            {stat.trend === "up" ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="rounded-full bg-muted p-2">
                        <stat.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="appointments">
              <TabsList>
                <TabsTrigger value="appointments">
                  Recent Appointments
                </TabsTrigger>
                <TabsTrigger value="users">Recent Users</TabsTrigger>
              </TabsList>
              <TabsContent
                value="appointments"
                className="bg-white p-4 rounded-md shadow mt-4"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayRecentAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">
                          {appointment.user.name}
                        </TableCell>
                        <TableCell>{appointment.service.name}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              appointment.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent
                value="users"
                className="bg-white p-4 rounded-md shadow mt-4"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead>Appointments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayRecentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.joinedDate}</TableCell>
                        <TableCell>{user.appointmentsCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminPage;
