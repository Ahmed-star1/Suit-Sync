import React from "react";
import LeftColumn from "../components/LeftImageColumn";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
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
