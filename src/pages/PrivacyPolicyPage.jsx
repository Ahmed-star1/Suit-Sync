import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import LeftColumnTabs from "../components/LeftColumnTabs";
import PrivacyPolicyTab from "../components/PrivacyPolicyTab";

const PrivacyPolicyPage = () => {
  return (
    <div className="main-page">
        <Header />
      <section className="main-section">
        <div className="container">
          <div className="row">
            <LeftColumnTabs />
            <PrivacyPolicyTab />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;