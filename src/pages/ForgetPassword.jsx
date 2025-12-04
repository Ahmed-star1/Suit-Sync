import React from "react";
import LeftColumn from "../components/LeftImageColumn";
import ForgetPasswordForm from "../components/ForgetPasswordForm";

const ForgetPasswordPage = () => {
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