import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const UserDetails = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        // Send GET request to fetch users
        const response = await axios.get("/api/v1/users", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authorization
          },
        });

        console.log("Fetched users:", response.data); // Check the structure of response data

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setUsers(response.data.data); // Correctly set the users data
        } else {
          setErrorMessage("No users found.");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 404 && error.response.data.message === "session expired") {
          localStorage.removeItem("token");
          alert("Session expired. Please log in again.");
          navigate("/"); // Redirect to login page
        } else {
          setErrorMessage("Error: " + error.message);
        }
      }
    };

    fetchUsers();
  }, [navigate]);

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      // Send DELETE request to delete user
      const response = await axios.delete(`/api/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token for authorization
        },
      });

      if (response.data && response.data.success) {
        setUsers(users.filter((user) => user._id !== userId)); // Remove user from state
        alert("User deleted successfully!");
      } else {
        setErrorMessage("Error deleting user.");
      }
    } catch (error) {
      setErrorMessage("Error: " + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">All Users</h1>

        {loading ? (
          <div className="text-gray-600">Loading users...</div>
        ) : errorMessage ? (
          <div className="text-red-600">{errorMessage}</div>
        ) : users.length === 0 ? (
          <div className="text-gray-600">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Verified</th>
                  <th className="px-4 py-2 text-left">Actions</th> {/* Add Actions column */}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-4 py-2">{user.name || "No name"}</td>
                    <td className="px-4 py-2">{user.emailId || "No email"}</td>
                    <td className="px-4 py-2">{user.role.roleName || "No role"}</td>
                    <td className="px-4 py-2">{user.isVerified ? "Verified" : "Not Verified"}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => deleteUser(user._id)} // Handle delete action
                        className="text-red-500 hover:text-red-700"
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

export default UserDetails;
