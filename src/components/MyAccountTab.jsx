import React, { useState, useRef } from "react";
import { FaPlus, FaPen } from "react-icons/fa";

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

  // Handle image change
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
    <div className="col-md-9 right-column">
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
                  <img
                    src={profileImage}
                    alt="Profile"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    className="image-edit-btn"
                    onClick={handlePencilClick}
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      background: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <FaPen size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className="placeholder-box"
                  onClick={handlePlusClick}
                  style={{
                    width: "150px",
                    height: "150px",
                    border: "2px dashed #ccc",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    backgroundColor: "#f8f9fa",
                  }}
                >
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
                </div>

                <div className="input-group">
                  <label>Last Name</label>
                  <input
                    className="input"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
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
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <div className="password-field">
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
                      {showPassword ? "Hide" : "Show"}
                    </span>
                  </div>
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
