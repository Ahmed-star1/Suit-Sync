import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import LeftColumnTabs from "../components/LeftColumnTabs";
import AddNewMembers from "../components/AddNewMembers";

const AddNewMembersPage = () => {
  return (
    <div className="main-page">
        <Header />
      <section className="main-section">
        <div className="container">
          <div className="row">
            <LeftColumnTabs />
            <AddNewMembers />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AddNewMembersPage;