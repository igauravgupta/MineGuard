// src/pages/ShowIncidents.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const ShowIncidents = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch incidents when the component is mounted
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem("token");
        // Send GET request to fetch incidents
        const response = await axios.get("/api/v1/incidentReportings", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authorization
          },
        });

        console.log("Fetched incidents:", response.data); // Check the structure of response data

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setIncidents(response.data.data); // Correctly set the incidents data
        } else {
          setErrorMessage("No incidents found.");
        }
        setLoading(false);
        
      } catch (error) {
        setLoading(false);
        // General error handling
        if (error.response) {
          // Handle specific error response codes
          if (error.response.status === 401) {
            setErrorMessage("Unauthorized. Please log in again.");
            localStorage.removeItem("token"); // Clear invalid token
            navigate("/"); // Redirect to login page
          } else if (error.response.status === 404 && error.response.data.message === "Session expired") {
            setErrorMessage("Incident types not found.");
            alert("Session expired. Please log in again.");
            navigate("/"); // Redirect to login page
          } else {
            console.error("Error fetching incidents:", error);
            setErrorMessage("Error fetching incidents: " + error.response.data.message);
          }
        } else if (error.request) {
          setErrorMessage("Network error. Please try again later.");
        } else {
          setErrorMessage("Error: " + error.message);
        }
      }
    };

    fetchIncidents();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">All Reported Incidents</h1>

        {loading ? (
          <div className="text-gray-600">Loading incidents...</div>
        ) : errorMessage ? (
          <div className="text-red-600">{errorMessage}</div>
        ) : incidents.length === 0 ? (
          <div className="text-gray-600">No incidents found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Severity</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Reported At</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident._id} className="border-t">
                    <td className="px-4 py-2">{incident.description || "No description"}</td>
                    <td className="px-4 py-2">{incident.location || "Unknown"}</td>
                    <td className="px-4 py-2">{incident.severity || "Not specified"}</td>
                    <td className="px-4 py-2">{incident.status || "Not specified"}</td>
                    <td className="px-4 py-2">
                      {incident.reportedAt
                        ? new Date(incident.reportedAt).toLocaleDateString()
                        : "Invalid date"}
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

export default ShowIncidents;
