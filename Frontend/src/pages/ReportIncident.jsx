import React, { use, useState } from "react";
import axios from "axios";
import ImageUpload from "../components/incidentReporting/ImageUpload";
import IncidentForm from "../components/incidentReporting/Incidentform";
import Navbar from "../components/UI/Navbar";
import Footer from "../components/UI/Footer";
import { classifyIncident } from "../features/IncidentReporting/classifyIncident"; 
import { useNavigate } from "react-router-dom";

const IncidentReportPage = () => {
   const navigate = useNavigate();
  
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleImageUpload = (imageFile) => {
    setImage(imageFile);
  };

  // Submitting incident report
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
  
    const resData = await classifyIncident(description, image);
    console.log("resData", resData);
  
    if (!resData) {
      setErrorMessage("Failed to classify incident.");
      setLoading(false);
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/v1/incidentReportings",
        { data: resData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        alert("Incident reported successfully!");
        setLoading(false);
        navigate("/dashboard"); // Redirect to home page after successful submission
      } else {
        setErrorMessage("Failed to save the incident. Please try again.");
        setLoading(false);
      }
  
    } catch (error) {
      console.error("Error saving incident:", error);
  
      // Handling session expired case properly here inside catch
      if (error.response && error.response.status === 404 && error.response.data.message === "session expired") {
        setErrorMessage("Session expired. Please log in again.");
        localStorage.removeItem("token");
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        setErrorMessage("Failed to save the incident. Please try again.");
      }
    }
    finally {
      setLoading(false); // Ensure loading is set to false in the finally block
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-6">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-semibold mb-6 text-center text-indigo-700">Incident Reporting</h2>

          {/* Description TextBox Component */}
          <IncidentForm description={description} setDescription={setDescription} />

          {/* Image Upload Component */}
          <ImageUpload onImageUpload={handleImageUpload} />

          {/* Error Message */}
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 border-4 border-t-4 border-indigo-600 border-solid rounded-full animate-spin"></div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading} // Disable the button when loading
          >
            {loading ? "Submitting..." : "Submit Incident"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default IncidentReportPage;
