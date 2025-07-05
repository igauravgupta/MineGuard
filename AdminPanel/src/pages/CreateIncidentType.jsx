// src/pages/ManageIncidentType.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ManageIncidentType = () => {
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!incidentType) {
      setErrorMessage("Incident Type is required");
      return;
    }

    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");

    // Check if token exists
    if (!token) {
      setErrorMessage("You need to be logged in to create an incident type.");
      return;
    }

    try {
      // Make the POST request to create incident type
      const response = await axios.post(
        "/api/v1/incidentTypes", // Make sure the full URL is provided
        {
          IncidentType: incidentType,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use token for authorization
          },
        }
      );

      // On success, show success message and reset form
      setSuccessMessage("Incident Type created successfully!");
      setIncidentType("");
      setDescription("");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage("Unauthorized. Please log in again.");
          localStorage.removeItem("token");
          navigate("/"); // Redirect to login page if unauthorized
        } else {
          setErrorMessage(error.response.data.message || "Error creating incident type");
        }
      } else {
        console.error("Error creating incident type:", error);
        setErrorMessage("An error occurred while creating incident type.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Incident Type</h1>
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700">
              Incident Type
            </label>
            <input
              type="text"
              id="incidentType"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          {errorMessage && (
            <div className="text-red-600 text-sm mb-2">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-600 text-sm mb-2">{successMessage}</div>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Incident Type
          </button>
        </form>
      </div>
    </>
  );
};

export default ManageIncidentType;
