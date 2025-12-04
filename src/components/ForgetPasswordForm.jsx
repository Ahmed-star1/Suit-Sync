import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const ForgetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleChange = () => {
    navigate("/verify-code");
  };

  return (
    <div className="right-form-column col-md-6">
      <div className="logo">
        <img src="/Images/blackLogo.png" alt="Logo" />
      </div>
      <div className="box">
        <h2>Forget Password</h2>
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

          <button type="button" className="designBtn2" onClick={handleChange}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPasswordForm;
