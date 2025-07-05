import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import CreateIncidentType from "../pages/CreateIncidentType";
import ShowIncidents from "../pages/ShowIncidents";
import ShowIncidentTypes from "../pages/ShowIncidentTypes";
import UserDetails from "../pages/UserDetails";
import CreateUserRole from "../pages/CreateUserRole";
import AllUserRoles from "../pages/AllUserRoles";

// Temporary ProtectedRoute logic
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // or your own auth method
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/incidentsType" element={<ProtectedRoute><CreateIncidentType/></ProtectedRoute>} />
      <Route path="/incidents" element={<ProtectedRoute><ShowIncidents /></ProtectedRoute>} />  
      <Route path="/showIncidentTypes" element={<ProtectedRoute><ShowIncidentTypes /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
      <Route path="/createUserRole" element={<ProtectedRoute><CreateUserRole /></ProtectedRoute>} />
      <Route path="/allUserRoles" element={<ProtectedRoute><AllUserRoles /></ProtectedRoute>} />
    </Routes>
    
  );  
};

export default AppRoutes;
