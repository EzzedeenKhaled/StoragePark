import React, { useState } from 'react';
import "./header.css";
import axios from '../../lib/axios';
import { useUserStore } from '../../src/stores/useUserStore';
import toast from 'react-hot-toast';
const Header = () => {
  const { user, setUser } = useUserStore(); // Assuming setUser is available to update user data
  const [profileImage, setProfileImage] = useState(
    user?.profileImage || "https://img.freepik.com/premium-vector/profile-icon-vector-image-can-be-used-ui_120816-169293.jpg"
  );
  const [isUpdating, setIsUpdating] = useState(false); // State to track if the image is being updated

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);

      setIsUpdating(true); // Show the loading spinner

      try {
        const response = await axios.post("/admins/updateImage", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Image Updated");
        setUser({ ...user, profileImage: response.data.profileImage }); 
        // Update the profile image in the state and user store
        setProfileImage(response.data.profileImage);
      } catch (error) {
        console.error("Error updating profile image:", error);
        toast.error("Failed to update image",error);
      } finally {
        setIsUpdating(false); // Hide the loading spinner
      }
    }
  };

  return (
    <div className="header1">
      <div className="profile-container">
        <label htmlFor="profile-upload" className="profile-upload-label">
          <div className="profile-picture-wrapper">
            <img
              src={profileImage}
              alt="Profile"
              className="profile-picture"
            />
            {isUpdating && <div className="loading-spinner"></div>} {/* Show spinner while updating */}
          </div>
        </label>
        <input
          type="file"
          id="profile-upload"
          accept="image/*"
          onChange={handleImageChange}
          className="profile-upload-input"
        />
        <span className="user-name">{user?.firstName || "User"}</span>
      </div>
    </div>
  );
};

export default Header;