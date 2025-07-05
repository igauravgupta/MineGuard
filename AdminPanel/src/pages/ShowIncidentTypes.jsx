// src/pages/ShowIncidentTypes.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const ShowIncidentTypes = () => {
  const navigate = useNavigate();
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidentTypes = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setErrorMessage("You need to be logged in to view incident types.");
          setLoading(false);
          return;
        }

        const response = await axios.get("/api/v1/incidentTypes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setIncidentTypes(response.data.data); // Correctly set the incident types
        } else {
          setErrorMessage("No incident types found.");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
          if (error.response && error.response.status === 404 && error.response.data.message === "session expired") {
            localStorage.removeItem("token"); 
            alert("Session expired. Please log in again.");
            navigate("/");
          } 
        else {
          setErrorMessage("Error: " + error.message);
        }
      }
    };

    fetchIncidentTypes();
  }, [navigate]);

  const deleteIncidentType = async (incidentTypeId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("You need to be logged in to delete incident types.");
        return;
      }

      const response = await axios.delete(`/api/v1/incidentTypes/${incidentTypeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Filter out the deleted incident type from the state
        setIncidentTypes(incidentTypes.filter((incident) => incident._id !== incidentTypeId));
      } else {
        setErrorMessage("Failed to delete incident type.");
      }
    } catch (error) {
      console.error("Error deleting incident type:", error);
      setErrorMessage("Error deleting incident type.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">All Incident Types</h1>

        {loading ? (
          <div className="text-gray-600">Loading incident types...</div>
        ) : errorMessage ? (
          <div className="text-red-600">{errorMessage}</div>
        ) : incidentTypes.length === 0 ? (
          <div className="text-gray-600">No incident types found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Incident Type</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidentTypes.map((incidentType) => (
                  <tr key={incidentType._id} className="border-t">
                    <td className="px-4 py-2">{incidentType.IncidentType}</td>
                    <td className="px-4 py-2">{incidentType.description || "No description"}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => deleteIncidentType(incidentType._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ShowIncidentTypes;
