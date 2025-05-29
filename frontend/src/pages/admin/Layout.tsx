import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  FileText,
  LogOut,
} from "lucide-react";
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

const AdminLayout = () => {
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
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
