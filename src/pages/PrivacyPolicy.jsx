import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

const personalInfoItems = [
  "Name",
  "Email address",
  "Phone number",
  "Shipping address",
  "Wedding or event date and location",
  "Fit or size preferences",
  "Payment information (securely processed)",
  "Group or groomsmen party info (if applicable)",
];

const nonPersonalItems = [
  "IP address",
  "Device or browser type",
  "Usage data (for example, pages you viewed)",
  "Cookies and pixel data",
];

const useInfoItems = [
  "Process your orders and send your rental items",
  "Suggest sizing based on your inputs or previous rentals",
  "Power your personalized Groomsmen Dashboard",
  "Notify you of shipping updates or returns",
  "Offer support or resolve account issues",
  "Improve our platform and user experience",
  "Send occasional promotions if you opt in",
];

const shareInfoItems = [
  "Trusted tech partners, such as measurement tools, shipping logistics, and payment gateways",
  "Customer support and communication platforms",
  "OEM manufacturers or fulfillment partners for direct-to-door suit delivery",
  "Law enforcement or regulatory authorities, if required by law",
];

const rightsItems = [
  "Request access to your stored data",
  "Ask us to correct or delete it",
  "Request a copy of the data we hold on you",
  "Withdraw consent for marketing communications",
];

const PrivacyPolicy = () => {
  return (
    <div className="return-policy-page simple-return-policy">
      <Header />

      <section className="simple-policy-section">
        <div className="container">
          <div className="simple-policy-card">
            <h2>Privacy Policy</h2>
            <p className="simple-policy-date">
              <strong>Effective Date:</strong> 28-08-2026
            </p>

            <div className="simple-policy-block no-border">
              <p>
                At SuitSync, we take your privacy seriously. This policy
                explains how we collect, use, and protect your personal data
                when you use our website, mobile app, or services.
              </p>
              <p>
                By accessing SuitSync&apos;s platform, you agree to the
                practices outlined below.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>What We Collect</h3>
              <p>We collect two types of information:</p>
              <p>
                <strong>1. Personal Information</strong>
              </p>
              <p>
                Details you provide directly to us or through your account,
                including:
              </p>
              <ul>
                {personalInfoItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                We may also collect measurement data or photos if you use our
                digital sizing tools powered by trusted third-party partners.
              </p>

              <p>
                <strong>2. Non-Personal Data</strong>
              </p>
              <p>Collected automatically when you use our services:</p>
              <ul>
                {nonPersonalItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="simple-policy-block">
              <h3>How We Use Your Info</h3>
              <p>We use your info to:</p>
              <ul>
                {useInfoItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>We never sell your data.</p>
            </div>

            <div className="simple-policy-block">
              <h3>Sharing Your Info</h3>
              <p>We only share your data with:</p>
              <ul>
                {shareInfoItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="simple-policy-block">
              <h3>Digital Measurement Tools</h3>
              <p>
                If you use a virtual measurement feature within SuitSync, such
                as 3D body scanning via mobile, you will be subject to that
                provider&apos;s own privacy policy. You will always have the
                opportunity to review that policy before submitting anything.
              </p>
              <p>
                We only receive anonymized size outputs and never raw image
                files.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>Cookies & Tracking</h3>
              <p>We use cookies to:</p>
              <ul>
                <li>Save your preferences</li>
                <li>Track cart or session information</li>
                <li>Monitor site traffic and performance</li>
              </ul>
              <p>
                You can disable cookies in your browser, but some features may
                not work properly.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>Data Security</h3>
              <p>
                We implement encryption, secure payment gateways, and
                account-level protections to keep your information safe. While
                no system is 100% immune to breaches, we work with top-tier
                vendors to minimize risks.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>Marketing Preferences</h3>
              <p>
                You will only receive emails or SMS if you opt in during
                checkout or account creation. You can unsubscribe at any time
                via:
              </p>
              <ul>
                <li>Email footer links</li>
                <li>Text &quot;STOP&quot; to opt out of SMS</li>
                <li>Adjusting preferences in your SuitSync profile</li>
              </ul>
            </div>

            <div className="simple-policy-block">
              <h3>Data Retention</h3>
              <p>We retain your personal info as long as:</p>
              <ul>
                <li>You have an account</li>
                <li>You have an open order</li>
                <li>We are required to by tax or regulatory law</li>
              </ul>
              <p>You can request deletion at any time.</p>
            </div>

            <div className="simple-policy-block">
              <h3>Your Rights</h3>
              <p>You can:</p>
              <ul>
                {rightsItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                To do so, email:{" "}
                <a href="mailto:privacy@suitsync.com">privacy@suitsync.com</a>
              </p>
              <p>
                If you are a California resident, you also have additional
                rights under the California Consumer Privacy Act (CCPA).
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>Children&apos;s Privacy</h3>
              <p>
                SuitSync is not intended for users under age 13. We do not
                knowingly collect data from children. If we learn we have
                received information from a minor, we will delete it
                immediately.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>Policy Updates</h3>
              <p>
                We may update this Privacy Policy from time to time. Major
                changes will be announced via email or platform notifications.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>Contact Us</h3>
              <p>
                Privacy questions? Reach out anytime at{" "}
                <a href="mailto:privacy@suitsync.com">privacy@suitsync.com</a>
              </p>
              <p>
                Or write us:
                <br />
                SuitSync Inc.
                <br />
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
