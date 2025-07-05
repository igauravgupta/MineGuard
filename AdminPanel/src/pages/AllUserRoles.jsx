import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const AllUserRoles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchRoles();
  }, [navigate]);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/v1/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched roles:", response.data);

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setRoles(response.data.data);
      } else {
        setErrorMessage("No roles found.");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404 && error.response.data.message === "session expired") {
        localStorage.removeItem("token");
        alert("Session expired. Please log in again.");
        navigate("/");
      } else {
        setErrorMessage("Error: " + error.message);
      }
    }
  };

  const handleDelete = async (roleId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this role?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/v1/roles/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // After successful deletion, remove role from local state
      setRoles((prevRoles) => prevRoles.filter((role) => role._id !== roleId));
      alert("Role deleted successfully!");
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Failed to delete role.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">All Roles</h1>

        {loading ? (
          <div className="text-gray-600">Loading roles...</div>
        ) : errorMessage ? (
          <div className="text-red-600">{errorMessage}</div>
        ) : roles.length === 0 ? (
          <div className="text-gray-600">No roles found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Role Name</th>
                  <th className="px-4 py-2 text-left">Permissions</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role._id} className="border-t">
                    <td className="px-4 py-2">{role.roleName || "No name"}</td>
                    <td className="px-4 py-2">
                      {role.permissions && role.permissions.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {role.permissions.map((perm, idx) => (
                            <li key={idx}>{perm}</li>
                          ))}
                        </ul>
                      ) : (
                        "No permissions"
                      )}
                    </td>
                    <td className="px-4 py-2">{role.description || "No description"}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(role._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
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

export default AllUserRoles;
