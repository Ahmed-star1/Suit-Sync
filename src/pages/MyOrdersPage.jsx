import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import LeftColumnTabs from "../components/LeftColumnTabs";
import MyOrdersTab from "../components/MyOrdersTab";

const MyOrdersPage = () => {
  return (
    <div className="main-page">
        <Header />
      <section className="main-section">
        <div className="container">
          <div className="row">
            <LeftColumnTabs />
            <MyOrdersTab />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MyOrdersPage;