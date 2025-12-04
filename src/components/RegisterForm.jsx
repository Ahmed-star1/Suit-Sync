import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";

const RightColumn = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = () => {
    navigate("/my-account");
  };

  return (
    <div className="right-form-column col-md-6">
      <div className="logo">
        <img src="/Images/blackLogo.png" alt="Logo" />
      </div>
      <div className="box">
        <h2>Register Now</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-field">
            <label>First Name</label>
            <input
              className="input"
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="input-field">
            <label>Last Name</label>
            <input
              className="input"
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="input-field">
            <label>Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

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

          <div className="checkbox">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
            />
            <label htmlFor="acceptTerms">
              By creating an account on SuitSync, you agree to the Terms &
              Conditions and Privacy Policy
            </label>
          </div>

          <button type="button" className="designBtn2"  onClick={handleChange}>Register</button>
        </form>
      </div>
      <div className="auth-link">
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default RightColumn;
