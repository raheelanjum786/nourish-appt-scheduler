
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLayout from "./pages/admin/Layout";
import AdminUsers from "./pages/admin/Users";
import AdminAppointments from "./pages/admin/Appointments";
import AdminServices from "./pages/admin/Services";
import AdminSettings from "./pages/admin/Settings";
import AdminMessages from "./pages/admin/Messages";

// Create a new QueryClient instance inside the component to ensure it's properly initialized
function App() {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Admin Routes - Only accessible by ADMIN users */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              
              {/* Protected Routes for authenticated users */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <div className="p-8">Profile page content (to be implemented)</div>
                </ProtectedRoute>
              } />
              <Route path="/appointments" element={
                <ProtectedRoute>
                  <div className="p-8">My appointments page content (to be implemented)</div>
                </ProtectedRoute>
              } />
              
              {/* Redirect unknown admin paths to admin dashboard */}
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Navigate to="/admin" replace />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
