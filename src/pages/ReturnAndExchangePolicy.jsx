import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

const returnItems = [
  "Unworn (trying on is okay), unwashed, and unaltered",
  "Free from stains, odors, or damage",
  "With original tags and packaging",
];

const returnSteps = [
  "Visit our Return Portal",
  "Download your prepaid UPS return label and packing slip",
  "Pack the item and drop it off at any UPS location",
  "Refunds are issued to your original payment method within 5-10 business days of return delivery",
];

const exchangeSteps = [
  "Log in to your SuitSync account or use the Exchange Portal",
  "Choose the same item in a different size or color, or select another suit style",
  "If the new item costs more, you will need to pay the difference",
  "Pack the original item, print your prepaid return label, and drop it at UPS",
  "Your replacement will ship within 2 business days after we receive the original item",
];

const ReturnAndExchangePolicy = () => {
  return (
    <div className="return-policy-page simple-return-policy">
      <Header />

      <section className="simple-policy-section">
        <div className="container">
          <div className="simple-policy-card">
            <h2>Return & Exchange Policy</h2>
            <p className="simple-policy-date">
              <strong>Updated:</strong> 28-08-2026
            </p>
            <p>
              We want your SuitSync experience to be flawless because wedding
              planning is stressful enough. If something is not right, we will
              do our best to fix it fast.
            </p>

            <div className="simple-policy-block">
              <h3>Returns & Exchanges Overview</h3>
              <p>
                If you are not 100% satisfied, you can return or exchange any
                eligible item within <strong>60 days of your event date</strong>.
              </p>
              <p>Items must be:</p>
              <ul>
                {returnItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                Items marked final sale or promotional may not be eligible for
                return.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>Return Process</h3>
              <ol>
                {returnSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p>
                <strong>Return Shipping Fee:</strong> A $10 return label fee
                will be deducted from your refund.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>Exchange Process</h3>
              <p>Need a different size or color? We have got you.</p>
              <ol>
                {exchangeSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p>
                <strong>Exchange Shipping:</strong> Your first exchange ships
                free. One free exchange per order.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>Need Help?</h3>
              <p>
                Our team is ready to help with any fit issues, replacements, or
                last-minute panic.
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:contact@suit-sync.com">contact@suit-sync.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReturnAndExchangePolicy;
