import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import LeftColumnTabs from "../components/LeftColumnTabs";
import EditEventMembers from "../components/EditEventMembers";

const EditEventMembersPage = () => {
  return (
    <div className="main-page">
        <Header />
      <section className="main-section">
        <div className="container">
          <div className="row">
            <LeftColumnTabs />
            <EditEventMembers />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default EditEventMembersPage;