import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        <h2>Login to Your Account</h2>
        <form onSubmit={(e) => e.preventDefault()}>
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
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="row">
            <div className="checkbox">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe">Remember Me</label>
            </div>
            <div className="forget">
              <a href="/forget-password">Forgot Password</a>
            </div>
          </div>

          <button type="button" className="designBtn2" onClick={handleChange}>Login</button>
        </form>
      </div>
      <div className="auth-link">
        <p>
          Don't have an account? <a href="/register">Register Now</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
