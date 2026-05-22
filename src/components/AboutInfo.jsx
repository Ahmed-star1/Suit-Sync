import React from "react";
import { Link } from "react-router-dom";
import { getAccessToken } from "../Redux/Utils/localStore";

const AboutInfo = () => {
  const hasAccessToken = Boolean(getAccessToken());

  return (
    <section className="about-info">
      <div className="container">
        <div className="row">
          <div className="col-md-6" data-aos="fade-up">
            <img src="/Images/aboutImage.png" />
          </div>
          <div class="col-md-6" data-aos="fade-left">
            <h2>Sharp Looks. Seamless Coordination</h2>
            <p>
              SuitSync was created to make wedding suit coordination simple.</p>
              <p>
              Planning a wedding is hard enough—keeping track of groomsmen ordering suits
              from different places shouldn’t add to the stress. SuitSync brings everything into
              one place so couples can create an event, assign looks to the wedding party,
              invite groomsmen, and track who has completed their order in real time.</p>
            <p>
              No more group chat confusion, missed deadlines, or wondering who still hasn’t
              ordered.
            </p>
            <p>We combine streamlined event management with quality suits from trusted
              manufacturers and real customer support every step of the way—from sizing
              help to delivery. Whether youre the groom organizing the crew or a groomsman
              checking off your task, SuitSync keeps everyone on the same page and the
              wedding party in sync.</p>
            <Link to={hasAccessToken ? "/events" : "/login"} className="designBtn">
              {hasAccessToken ? "View Events" : "Get Started"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutInfo;
