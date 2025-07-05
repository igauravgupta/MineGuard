import React, { useState } from "react";

const ImageUpload = ({ onImageUpload }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    onImageUpload(file); // Pass image file to parent component
  };

  return (
    <div className="mb-4">
      <label htmlFor="incidentImage" className="block text-sm font-semibold">
        Upload Image:
      </label>
      <input
        type="file"
        id="incidentImage"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full p-2 border border-gray-300 rounded"
      />
      {image && (
        <div className="mt-2">
          <img src={image} alt="Uploaded preview" className="w-48 h-48 object-cover rounded" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
