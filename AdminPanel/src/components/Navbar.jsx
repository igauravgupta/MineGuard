import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    navigate("/"); // Redirect to login page
  };

  // Check token live every time Navbar renders
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div>
      <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow-md border-b border-blue-300">
        <h1 className="text-2xl font-bold text-black">MineGuard</h1>

        {/* Login / Logout Button */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Logout
            </button>
          ) : null}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
