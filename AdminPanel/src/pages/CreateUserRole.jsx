import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const CreateUserRole = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([""]);
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePermissionChange = (index, value) => {
    const updatedPermissions = [...permissions];
    updatedPermissions[index] = value;
    setPermissions(updatedPermissions);
  };

  const addPermissionField = () => {
    setPermissions([...permissions, ""]);
  };

  const removePermissionField = (index) => {
    const updatedPermissions = permissions.filter((_, i) => i !== index);
    setPermissions(updatedPermissions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/v1/roles",
        {
          roleName,
          permissions: permissions.filter(p => p.trim() !== ""), // remove empty permissions
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        setSuccessMessage("Role created successfully!");
        setRoleName("");
        setPermissions([""]);
        setDescription("");
      } else {
        setErrorMessage("Failed to create role.");
      }
    } catch (error) {
      setErrorMessage("Error: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Create New Role</h1>

        {errorMessage && <div className="text-red-600 mb-2">{errorMessage}</div>}
        {successMessage && <div className="text-green-600 mb-2">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Role Name:</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Permissions:</label>
            {permissions.map((permission, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={permission}
                  onChange={(e) => handlePermissionChange(index, e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="Enter permission"
                />
                <button
                  type="button"
                  onClick={() => removePermissionField(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPermissionField}
              className="text-blue-500 hover:text-blue-700"
            >
              + Add Permission
            </button>
          </div>

          <div>
            <label className="block font-semibold mb-1">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows="3"
              placeholder="Enter role description"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Role
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateUserRole;
