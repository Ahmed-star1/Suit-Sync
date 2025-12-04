import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const countries = [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "IN", label: "India" },
  ];

  const statesByCountry = {
    US: ["California", "Texas", "Florida"],
    CA: ["Ontario", "Quebec", "British Columbia"],
    IN: ["Maharashtra", "Karnataka", "Delhi"],
  };

  const citiesByState = {
    California: ["Los Angeles", "San Francisco", "San Diego"],
    Texas: ["Houston", "Austin", "Dallas"],
    Florida: ["Miami", "Orlando", "Tampa"],
    Ontario: ["Toronto", "Ottawa", "Hamilton"],
    Quebec: ["Montreal", "Quebec City", "Gatineau"],
    "British Columbia": ["Vancouver", "Victoria", "Surrey"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Karnataka: ["Bangalore", "Mysore", "Mangalore"],
    Delhi: ["New Delhi", "Faridabad", "Gurgaon"],
  };

  useEffect(() => {
    const fakeCart = [
      {
        id: 1,
        name: "Surfboards",
        price: 875,
        qty: 1,
        image: "/Images/suit1.png",
        details: ["John Holly — Seagull"],
      },
    ];
    setCart(fakeCart);
  }, []);

  const subtotal = cart.reduce((t, item) => t + item.price * item.qty, 0);
  const total = subtotal;

  const handleCountryChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedCountry(selectedOption);
    setSelectedState(null); // Reset state when country changes
    setSelectedCity("");
  };

  const handleStateChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedState(selectedOption);
    setSelectedCity("");
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
  };

  return (
    <div className="checkout-page">
      <Header />

      <div className="container">
        <div className="row checkout-row">
          <div className="checkout-left col-md-8">
            <div className="contect-field">
              <h3>Contact information</h3>
              <input
                type="email"
                className="input"
                placeholder="Email address"
              />
            </div>
            <h3>Billing address</h3>

            <div className="select-field">
              <select value={selectedCountry} onChange={handleCountryChange}>
                <option value="">Select Country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="row-fields">
              <div className="select-field">
                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  disabled={!selectedCountry}
                >
                  <option value="">Select State</option>
                  {selectedCountry &&
                    statesByCountry[selectedCountry]?.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                </select>
              </div>
              <div className="select-field">
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  disabled={!selectedState}
                >
                  <option value="">Select City</option>
                  {selectedState &&
                    citiesByState[selectedState]?.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="row-fields">
              <div className="field">
                <input type="text" className="input" placeholder="First name" />
              </div>
              <div className="field">
                <input type="text" className="input" placeholder="Last name" />
              </div>
            </div>

            <div className="row-fields">
              <div className="field">
                <input type="text" className="input" placeholder="ZIP Code" />
              </div>
              <div className="field">
                <input
                  className="input"
                  type="text"
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <div className="row-fields">
              <div className="field">
                <input type="text" className="input" placeholder="Address" />
              </div>
            </div>

            <h3>Payment options</h3>

            <div className="payment-error-box">
              <span>⚠</span>
              There are no payment methods available. Please contact us for
              assistance.
            </div>

            <p className="policy-text">
              By proceeding with your purchase you agree to our Terms and
              Conditions and Privacy Policy
            </p>

            <div className="buttons">
              <a href="/cart">← Return to Cart</a>
              <button className="designBtn2">Place Order</button>
            </div>
          </div>
          <div className="checkout-right col-md-4">
            <div className="summary-box">
              <h3>Order summary</h3>

              {cart.map((item) => (
                <div className="summary-item" key={item.id}>
                  <img src={item.image} alt="" />

                  <div className="summary-info">
                    <h4>{item.name}</h4>
                    <span className="summary-price">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.details.map((d, i) => (
                      <p key={i}>{d}</p>
                    ))}
                  </div>

                  <span className="summary-price">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
