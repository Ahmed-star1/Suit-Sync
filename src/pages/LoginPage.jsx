import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import LeftColumn from "../components/LeftImageColumn";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  return (
    <div className="auth-page">
      <div className="row auth-row">
        <LeftColumn
          image={"/Images/loginBackground.png"}
          title={"Find Your Signature Suit or Tuxedo"}
        />
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
