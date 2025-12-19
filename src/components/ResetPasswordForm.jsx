import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = () => {
    navigate("/login");
  };

  return (
    <div className="right-form-column col-md-6" data-aos="fade-left">
      <div className="logo">
        <img src="/Images/blackLogo.png" alt="Logo" />
      </div>
      <div className="box">
        <h2>New Password</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-field password-field">
            <label>Password</label>
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
            </span>
          </div>

          <div className="input-field password-field">
            <label>Confirm Password</label>
            <input
              className="input"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}{" "}
            </span>
          </div>

          <button type="button" className="designBtn2" onClick={handleChange}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
