import {
  Bike,
  Star,
  ChevronDown,
  User,
  LogOut,
  Bookmark,
  Home,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [profileDropdown, setProfileDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/cd">
          <div className="flex items-center gap-2">
            <Bike className="h-8 w-8 text-emerald-600" strokeWidth={1.5} />
            <span className="text-xl font-bold text-gray-900">Rent-A-Bike</span>
          </div></Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 transition font-medium"
            >
              <Home className="h-4 w-4" /> Home
            </a>
            <a
              href="#"
              className="flex items-center gap-1 text-gray-700 hover:text-emerald-600 transition font-medium"
            >
              <Bookmark className="h-4 w-4" /> My Bookings
            </a>
            
          </div>

          
          <div className="relative hidden md:block">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-2 transition"
            >
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                U
              </div>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>

            {profileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                
                <Link to="/" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-emerald-50 transition">
                  <User className="h-4 w-4" /> Profile
                </Link>
                
                <Link to="/" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-emerald-50 transition">
                  <LogOut className="h-4 w-4" /> Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
