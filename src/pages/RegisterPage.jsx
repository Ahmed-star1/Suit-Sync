import React from "react";
import LeftColumn from "../components/LeftImageColumn";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="auth-page">
      <div className="row auth-row">
        <LeftColumn
          image={"/Images/RegisterBackground.png"}
          title={"Unveil Your Ideal Look Suit or Tuxedo"}
        />
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;