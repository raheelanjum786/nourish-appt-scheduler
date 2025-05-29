import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import api from "@/services/api";

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

const AdminDashboard = () => {
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
        const stats = await api.admin.getDashboardStats();
        setDashboardStats(stats);
      } catch (err: any) {
        setErrorStats(err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []); // Empty dependency array means this effect runs once on mount

  // Fetch recent appointments on component mount
  useEffect(() => {
    const fetchRecentAppointments = async () => {
      try {
        const appointments = await api.admin.getRecentAppointments();
        setRecentAppointmentsData(appointments);
      } catch (err: any) {
        setErrorAppointments(err);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchRecentAppointments();
  }, []);

  // Fetch recent users on component mount
  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const users = await api.admin.getRecentUsers();
        setRecentUsersData(users);
      } catch (err: any) {
        setErrorUsers(err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchRecentUsers();
  }, []);

  // Display loading or error states if necessary
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

  // Use fetched data or fallback to mock data if fetching fails or data is null
  const displayStats = dashboardStats || statsData;
  const displayRecentAppointments =
    recentAppointmentsData.length > 0
      ? recentAppointmentsData
      : recentAppointments;
  const displayRecentUsers =
    recentUsersData.length > 0 ? recentUsersData : recentUsers;

  return (
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
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
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
          <TabsTrigger value="appointments">Recent Appointments</TabsTrigger>
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
                    {appointment.user}
                  </TableCell>
                  <TableCell>{appointment.service}</TableCell>
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
                  <TableCell className="font-medium">{user.name}</TableCell>
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
  );
};

export default AdminDashboard;
