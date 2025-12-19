import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import LeftColumn from "../components/LeftImageColumn";
import ForgetPasswordForm from "../components/ForgetPasswordForm";

const ForgetPasswordPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  return (
    <div className="auth-page">
      <div className="row auth-row">
        <LeftColumn
          image={"/Images/innerBackground.png"}
          title={"Crafted with Care, Delivered with Trust"}
        />
        <ForgetPasswordForm />
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
