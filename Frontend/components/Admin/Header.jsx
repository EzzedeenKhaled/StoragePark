// Header.jsx
import React, { useState } from 'react';
import "./header.css";
import pic from "/pic.png";

const Header = () => {
  const [profileImage, setProfileImage] = useState(pic);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="header">
      <div className="profile-container">
        <label htmlFor="profile-upload" className="profile-upload-label">
          <img src={profileImage} alt="Profile" className="profile-picture" />
        </label>
        <input
          type="file"
          id="profile-upload"
          accept="image/*"
          onChange={handleImageChange}
          className="profile-upload-input"
        />
        <span className="user-name">Darine Chames</span>
      </div>
    </div>
  );
};

export default Header;
