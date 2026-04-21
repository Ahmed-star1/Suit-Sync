import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import LeftColumnTabs from "../components/LeftColumnTabs";
import ChangePassword from "../components/ChangePassword";

const MyAccountPge = () => {
  return (
    <div className="main-page">
        <Header />
      <section className="main-section">
        <div className="container">
          <div className="row">
            <LeftColumnTabs />
            <ChangePassword />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MyAccountPge;