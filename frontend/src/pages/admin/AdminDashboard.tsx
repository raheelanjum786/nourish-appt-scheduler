import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import { useAuth } from "../../context/AuthContext";
import adminService from "../../services/adminService";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appointmentsRes, usersRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getRecentAppointments(),
          adminService.getRecentUsers(),
        ]);

        setStats(statsRes.stats);
        setRecentAppointments(appointmentsRes);
        setRecentUsers(usersRes);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    if (user?.role === "ADMIN") {
      fetchData();
    }
  }, [user]);

  if (!stats) return <div>Loading...</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Appointments</Typography>
              <Typography variant="h4">{stats.totalAppointments}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Completed</Typography>
              <Typography variant="h4">
                {stats.completedAppointments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending</Typography>
              <Typography variant="h4">{stats.pendingAppointments}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4">
                ${stats.totalRevenue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appointments Overview
              </Typography>
              <BarChart
                series={[
                  {
                    data: [
                      stats.pendingAppointments,
                      stats.completedAppointments,
                    ],
                  },
                ]}
                height={300}
                xAxis={[{ data: ["Pending", "Completed"], scaleType: "band" }]}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Users vs Services
              </Typography>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: stats.totalUsers, label: "Users" },
                      { id: 1, value: stats.totalServices, label: "Services" },
                    ],
                  },
                ]}
                width={400}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Data Tables */}
        <Grid item xs={12}>
          {/* Implement tables for recent appointments and users */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
