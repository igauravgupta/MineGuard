import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [incidentData, setIncidentData] = useState({ open: 0, closed: 0 });
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-black mb-10">Admin Dashboard</h1>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Incident Section Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg text-black hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6">Incident Section</h2>
            <button
              onClick={() => navigate("/incidentsType")}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-200 mb-4"
            >
              Create Incident Types
            </button>
            <button
              onClick={() => navigate("/incidents")}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-200 mb-4"
            >
              View All Incidents
            </button>
            <button
              onClick={() => navigate("/showIncidentTypes")}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              View All Incident Types
            </button>
          </div>

          {/* User's Role Section Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg text-black hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6">User's Role Section</h2>
            <button
              onClick={() => navigate("/users")}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-200 mb-4"
            >
              View All Users
            </button>
            <button
              onClick={() => navigate("/createUserRole")}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-200 mb-4"
            >
              Create User Role
            </button>
            <button
              onClick={() => navigate("/allUserRoles")}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              All User Roles
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
