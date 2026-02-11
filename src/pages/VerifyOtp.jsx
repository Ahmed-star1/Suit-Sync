import React from "react";
import LeftColumn from "../components/LeftImageColumn";
import VarifyOtpForm from "../components/VerifyOtpForm";

const VerifyOtpPage = () => {
  return (
    <div className="auth-page verify">
      <div className="row auth-row">
        <LeftColumn
          image={"/Images/innerBackground.png"}
          title={"Crafted with Care, Delivered with Trust"}
        />
        <VarifyOtpForm />
      </div>
    </div>
  );
};

export default VerifyOtpPage;