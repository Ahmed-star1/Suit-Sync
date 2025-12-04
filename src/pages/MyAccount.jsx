import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import LeftColumnTabs from "../components/LeftColumnTabs";
import MyAccountTab from "../components/MyAccountTab";

const MyAccountPge = () => {
  return (
    <div className="main-page">
        <Header />
      <section className="main-section">
        <div className="container">
          <div className="row">
            <LeftColumnTabs />
            <MyAccountTab />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MyAccountPge;
