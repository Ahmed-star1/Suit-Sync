import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import LeftColumnTabs from "../components/LeftColumnTabs";
import AddEventMember from "../components/AddEventMember";

const AddEventMemberPage = () => {
  return (
    <div className="main-page">
        <Header />
      <section className="main-section">
        <div className="container">
          <div className="row">
            <LeftColumnTabs />
            <AddEventMember />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AddEventMemberPage;