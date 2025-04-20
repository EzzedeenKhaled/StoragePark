import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useUserStore } from "../src/stores/useUserStore";

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear store, cookies, etc.
    navigate("/login");
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 cursor-pointer"
      >
        <img
          src={user?.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzcsHv578aOlNW5kDRZ5Lc5AZQowEd-fojyQ&s"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
          <Link 
            to="/profile" 
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <User size={18} /> <span className="ml-2">Profile</span>
          </Link>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <LogOut size={18} /> <span className="ml-2">Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}
