import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from 'react-router-dom';

const VerifyCodeForm = () => {
  useEffect(() => {
      AOS.init({ duration: 1000, once: true });
    }, []);
  const [OTPCode, setOTPCode] = useState("");
  const navigate = useNavigate();

  const handleChange = () => {
    navigate("/reset-password");
  };

  return (
    <div className="right-form-column col-md-6" data-aos="fade-left">
      <div className="logo">
        <img src="/Images/blackLogo.png" alt="Logo" />
      </div>
      <div className="box">
        <h2>Verify Code</h2>
        <p>Verify code which is sent to you email address</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-field">
            <input
              className="input"
              type="text"
              placeholder="Enter OTP"
              value={OTPCode}
              onChange={(e) => setOTPCode(e.target.value)}
            />
          </div>

          <button type="button" className="designBtn2" onClick={handleChange}>Verify</button>
        </form>
      </div>
      <div className="auth-link">
        <p>
          Don’t get a code <a href="#">Send Again</a>
        </p>
      </div>
    </div>
  );
};

export default VerifyCodeForm;