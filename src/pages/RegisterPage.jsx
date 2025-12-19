import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import LeftColumn from "../components/LeftImageColumn";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

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
