import React from "react";

const IncidentForm = ({ description, setDescription }) => {
  return (
    <div className="mb-4">
      <label htmlFor="incidentDescription" className="block text-sm font-semibold">
        Incident Description:
      </label>
      <textarea
        id="incidentDescription"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the incident"
        required
        className="w-full p-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows="4"
      />
    </div>
  );
};

export default IncidentForm;
