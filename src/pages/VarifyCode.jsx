import React from "react";
import LeftColumn from "../components/LeftImageColumn";
import VarifyCodeForm from "../components/VarifyCodeForm";

const VerifyCodePage = () => {
  return (
    <div className="auth-page verify">
      <div className="row auth-row">
        <LeftColumn
          image={"/Images/innerBackground.png"}
          title={"Crafted with Care, Delivered with Trust"}
        />
        <VarifyCodeForm />
      </div>
    </div>
  );
};

export default VerifyCodePage;