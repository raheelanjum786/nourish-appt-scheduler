
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          <Button className="btn-primary">Login</Button>
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
            <Button className="btn-primary self-start">Login</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
