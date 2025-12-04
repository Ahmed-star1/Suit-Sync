import React from "react";
import LeftColumn from "../components/LeftImageColumn";
import ResetPasswordForm from "../components/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <div className="auth-page">
      <div className="row auth-row">
        <LeftColumn
          image={"/Images/innerBackground.png"}
          title={"Crafted with Care, Delivered with Trust"}
        />
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPassword;