import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
import { ServiceProvider } from "./context/ServiceContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Import your pages
import HomePage from "./pages/Index";
import AboutPage from "./pages/About";
import ServicesPage from "./pages/Services";
import BookingPage from "./pages/Booking";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Signup";
import DashboardPage from "./pages/Dashboard";
import ProfilePage from "./pages/Profile";
import NotFoundPage from "./pages/NotFound";
// import AdminDashboardPage from "./pages/admin/Layout";
import AdminDashboardPage from "./pages/admin/AdminPage";
import AdminPlansPage from "./pages/admin/AdminPlansPage";
import UserPlansPage from "./pages/UserPlansPage";
import ContactPage from "./pages/Contact";
import Appointment from "./pages/Appointment";

// Add this import
import AdminTimeSlots from "./pages/admin/TimeSlots";
import AdminUsers from "./pages/admin/Users";
import AdminAppointments from "./pages/admin/Appointments";
import AdminServices from "./pages/admin/Services";
import AdminMessages from "./pages/admin/Messages";
import AdminSettings from "./pages/admin/Settings";

function App() {
  return (
    <AuthProvider>
      <ServiceProvider>
        <AppointmentProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/appointments" element={<Appointment />} />
              <Route path="/plans" element={<UserPlansPage />} />

              <Route
                path="/booking"
                element={
                  // <ProtectedRoute>
                  <BookingPage />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  // <ProtectedRoute adminOnly>
                  <AdminDashboardPage />
                  // </ProtectedRoute>
                }
              />
              <Route path="/admin/time-slots" element={<AdminTimeSlots />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route
                path="/admin/appointments"
                element={<AdminAppointments />}
              />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              {/* <Route path="/admin/time-slots" element={<AdminTimeSlots />} /> */}
              <Route
                path="/admin/plans"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPlansPage />
                  </ProtectedRoute>
                }
              />

              {/* User routes for plans */}

              {/* 404 route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toaster />
          </Router>
        </AppointmentProvider>
      </ServiceProvider>
    </AuthProvider>
  );
}

export default App;
