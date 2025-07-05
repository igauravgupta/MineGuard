import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location to track the active page

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // User is logged in
    } else {
      setIsAuthenticated(false); // User is not logged in
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    setIsAuthenticated(false); // Update the state to reflect logged out
    navigate("/"); // Redirect to login page
  };

  // Function to check if the current link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow-md border-b border-blue-300">
        <h1 className="text-2xl font-bold">MineGuard</h1>
        <div className="flex-1 flex justify-center space-x-6">
          <Link
            to="/"
            className={`hover:underline ${isActive("/") ? "text-blue-600 font-semibold" : "text-gray-700"}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`hover:underline ${isActive("/about") ? "text-blue-600 font-semibold" : "text-gray-700"}`}
          >
            About
          </Link>
          <Link
            to="/chatbot"
            className={`hover:underline ${isActive("/chatbot") ? "text-blue-600 font-semibold" : "text-gray-700"}`}
          >
            Chatbot
          </Link>
          <Link
            to="/reportIncident"
            className={`hover:underline ${isActive("/reportIncident") ? "text-blue-600 font-semibold" : "text-gray-700"}`}
          >
            Report Incident
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            // Display profile circle and logout button when authenticated
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-400 rounded-full overflow-hidden">
                <Link to="/dashboard">
                <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" // Placeholder image
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </Link>
              </div>
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          ) : (
            // Display login/signup buttons when not authenticated
            <>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/SignUp"
                className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
              >
                SignUp
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
