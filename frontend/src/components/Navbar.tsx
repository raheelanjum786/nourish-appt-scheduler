
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container-custom flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl text-nutrition-primary">NutriCare</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium hover:text-nutrition-primary transition-colors">
            Home
          </Link>
          <Link to="/services" className="font-medium hover:text-nutrition-primary transition-colors">
            Services
          </Link>
          <Link to="/about" className="font-medium hover:text-nutrition-primary transition-colors">
            About Me
          </Link>
          <Link to="/contact" className="font-medium hover:text-nutrition-primary transition-colors">
            Contact
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center gap-2">
                  <User size={20} />
                  <span>{user?.name?.split(' ')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user?.role === 'ADMIN' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/appointments')}>
                  My Appointments
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn size={18} />
                  Login
                </Link>
              </Button>
              <Button className="btn-primary" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            className="text-gray-700 focus:outline-none" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-md py-4 animate-fade-in">
          <div className="container-custom flex flex-col space-y-4">
            <Link 
              to="/" 
              className="font-medium hover:text-nutrition-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="font-medium hover:text-nutrition-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="font-medium hover:text-nutrition-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About Me
            </Link>
            <Link 
              to="/contact" 
              className="font-medium hover:text-nutrition-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' && (
                  <Link 
                    to="/admin" 
                    className="font-medium hover:text-nutrition-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="font-medium hover:text-nutrition-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  to="/appointments" 
                  className="font-medium hover:text-nutrition-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Appointments
                </Link>
                <Button 
                  variant="ghost" 
                  className="justify-start p-0 hover:bg-transparent text-red-500" 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" className="justify-start p-0 hover:bg-transparent" asChild>
                  <Link to="/login" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button className="btn-primary self-start" asChild>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
