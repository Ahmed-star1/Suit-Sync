import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

const platformUses = [
  "Create and manage events",
  "Add and invite groomsmen",
  "Collect and submit measurements",
  "Select suit styles, accessories, and preferences",
  "Track order status and logistics",
];

const restrictedUses = [
  "Submit false or misleading information",
  "Post harmful or offensive content",
  "Attempt to interfere with our systems",
  "Collect user data or scrape the Platform",
];

const rentalItems = [
  "Jacket, pants, shirt, vest, tie",
  "Optional add-ons: shoes, cufflinks, lapel pins, etc.",
];

const damageItems = [
  "Loss or theft",
  "Malicious or excessive damage",
  "Late return penalties",
];

const replacementCosts = [
  "Jacket: $470",
  "Pants: $200",
  "Shirt: $50",
  "Vest: $100",
  "Tie: $40",
  "Shoes: $70",
];

const TermsAndConditions = () => {
  return (
    <div className="return-policy-page simple-return-policy">
      <Header />

      <section className="simple-policy-section">
        <div className="container">
          <div className="simple-policy-card">
            <h2>Terms & Conditions</h2>
            <p className="simple-policy-date">
              <strong>Last updated:</strong> 28-08-2026
            </p>

            <div className="simple-policy-block no-border">
              <h3>Part 1: SuitSync Terms of Use</h3>
              <p>
                Welcome to SuitSync. These Terms of Use govern your access to
                and use of the SuitSync website and mobile application
                (collectively, the Platform), operated by SuitSync, LLC.
              </p>
              <p>
                By accessing or using our Platform, you agree to these Terms
                and our Privacy Policy. If you do not agree, please do not use
                the Platform.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>1. Eligibility & Account Registration</h3>
              <p>
                You must be at least 18 years old to use SuitSync. When you
                create an account, you agree to provide accurate, complete, and
                up-to-date information. You are responsible for maintaining the
                security of your account and for all activity that occurs under
                it.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>2. Platform Use</h3>
              <p>
                SuitSync is designed to simplify the wedding suit rental and
                planning process. Through our app, users can:
              </p>
              <ul>
                {platformUses.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>You agree to use the Platform only for lawful purposes and not to:</p>
              <ul>
                {restrictedUses.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="simple-policy-block">
              <h3>3. Intellectual Property</h3>
              <p>
                All content on the Platform, including logos, graphics, images,
                software, and text, is owned by SuitSync or licensed to us. You
                may not copy, modify, distribute, or create derivative works
                without our express permission.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>4. User Content</h3>
              <p>
                By submitting reviews, comments, or media through the Platform,
                you grant SuitSync a non-exclusive, royalty-free license to use
                that content for promotional and operational purposes, in line
                with our Privacy Policy.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>5. Disclaimers</h3>
              <p>
                Our service is provided as is. We do not guarantee that the
                Platform will always be available or error-free. We disclaim all
                warranties, express or implied, including fitness for a
                particular purpose.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>6. Limitation of Liability</h3>
              <p>
                To the fullest extent permitted by law, SuitSync shall not be
                liable for any indirect, incidental, or consequential damages
                arising out of or related to your use of the Platform or any
                products ordered.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>7. Termination</h3>
              <p>
                We may suspend or terminate your access if you violate these
                Terms or misuse the Platform. You may cancel your account at any
                time.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>8. Governing Law</h3>
              <p>
                These Terms are governed by the laws of the State of New
                Hampshire. Any legal disputes must be filed in courts located
                within Rockingham County, NH.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>Part 2: SuitSync Rental & Purchase Agreement</h3>
              <p>
                By placing a rental or purchase order with SuitSync, you agree
                to the following terms:
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>1. Rental Package</h3>
              <ul>
                {rentalItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                Prices are displayed in USD and are subject to change. Rentals
                start at $149 and include free shipping on orders over $99.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>2. Measurements</h3>
              <p>
                All measurements must be submitted at least 14 days prior to
                the event via the SuitSync app. Users may measure themselves
                using our digital guide and request a free tailor&apos;s tape if
                needed.
              </p>
              <p>
                Failure to submit accurate measurements on time may lead to
                shipping delays, additional charges, or inability to fulfill the
                order.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>3. Payment</h3>
              <p>
                Full payment is due at checkout. We accept major credit/debit
                cards and process payments securely via Stripe.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>4. Shipping & Returns</h3>
              <ul>
                <li>Orders ship approximately 7-10 days before your event.</li>
                <li>
                  Returns are due by the first business day after the event
                  using the prepaid return label provided.
                </li>
                <li>
                  Late returns incur a fee of $20 per day, with full replacement
                  charges assessed after 21 days.
                </li>
                <li>
                  We do not ship to PO Boxes, Alaska, Hawaii, or outside the
                  U.S. at this time.
                </li>
              </ul>
            </div>

            <div className="simple-policy-block">
              <h3>5. Damage Policy</h3>
              <p>
                Each rental includes a $10 accidental damage waiver, which
                covers minor wear and tear. This does not cover:
              </p>
              <ul>
                {damageItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>Replacement costs for lost or unreturned items are as follows:</p>
              <ul>
                {replacementCosts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="simple-policy-block">
              <h3>6. Cancellations & Refunds</h3>
              <ul>
                <li>Cancel 15+ days before your event: full refund.</li>
                <li>Cancel under 15 days, before shipping: 50% refund.</li>
                <li>After shipment: no refund.</li>
              </ul>
            </div>

            <div className="simple-policy-block">
              <h3>7. Replacement & Style Changes</h3>
              <ul>
                <li>One free replacement per order within 24 hours of delivery.</li>
                <li>Style changes after checkout incur a $20 fee.</li>
                <li>
                  Rush orders (less than 14 days from the event) incur a $20-$60
                  fee, depending on lead time.
                </li>
              </ul>
            </div>

            <div className="simple-policy-block">
              <h3>8. Promotions</h3>
              <p>
                From time to time, SuitSync may offer promotional deals, such
                as free groom rental after 6 paid packages. These offers are
                subject to change and cannot be combined with other discounts.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>9. SMS Communications</h3>
              <p>
                By creating an account, you agree to receive order updates and
                reminders via text. Standard messaging rates apply. Reply
                &quot;STOP&quot; to opt out at any time.
              </p>
            </div>

            <div className="simple-policy-block">
              <h3>10. Contact</h3>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:support@suitsync.com">support@suitsync.com</a>
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a href="tel:6033161725">603-316-1725</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
