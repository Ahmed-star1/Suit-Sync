import React, { useState, useRef } from "react";
import { FaPlus, FaPen, FaEye, FaEyeSlash } from "react-icons/fa";

const MyAccountTab = () => {
  const userData = {
    firstName: "Wilson",
    lastName: "Smith",
    email: "wilson.smith@example.com",
    profileImage: "",
  };

  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [email, setEmail] = useState(userData.email);
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(userData.profileImage);
  const [showPassword, setShowPassword] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };

  const handlePlusClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePencilClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="col-md-9 right-column my-account">
      <div className="right-column-content">
        <h2>My Profile</h2>
        <form>
          <div className="profile-info">
            <div className="profile-image">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              {profileImage ? (
                <div
                  className="image-container"
                  style={{ position: "relative" }}
                >
                  <img src={profileImage} alt="Profile" />
                  <button
                    type="button"
                    className="image-edit-btn"
                    onClick={handlePencilClick}
                  >
                    <FaPen size={16} />
                  </button>
                </div>
              ) : (
                <div className="placeholder-box" onClick={handlePlusClick}>
                  <FaPlus />
                </div>
              )}
            </div>

            <div className="profile-form">
              <div className="row">
                <div className="input-group">
                  <label>First Name</label>
                  <input
                    className="input"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <i class="fa-solid fa-pencil"></i>
                </div>

                <div className="input-group">
                  <label>Last Name</label>
                  <input
                    className="input"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <i class="fa-solid fa-pencil"></i>
                </div>
              </div>

              <div className="row">
                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <i class="fa-solid fa-pencil"></i>
                </div>

                <div className="input-group password-field">
                  <label>Password</label>
                  <input
                    className="input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
        <button type="button" className="designBtn2">
          Save
        </button>
      </div>
    </div>
  );
};

export default MyAccountTab;
