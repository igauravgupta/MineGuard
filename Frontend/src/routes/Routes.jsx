import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/HomePage";
import Login from "../features/auth/Login";
import Signup from "../features/auth/SignUp";
import Chatbot from "../pages/ChatbotPage";
import IncidentReportPage from "../pages/ReportIncident";
import AboutPage from "../pages/About";


// Temporary ProtectedRoute logic
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // or your own auth method
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reportIncident" element={<ProtectedRoute> <IncidentReportPage /></ProtectedRoute>} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/dashboard" element={<ProtectedRoute> <Home /></ProtectedRoute>} />
    </Routes>
    
  );
};

export default AppRoutes;
