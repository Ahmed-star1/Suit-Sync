import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
// State and city will be simple text inputs now (no country-state-city package)
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "../components/header";
import Footer from "../components/footer";
import Loader from "../components/Loader";
import StripePaymentForm from "../components/StripePaymentForm";
import { getCart } from "../Redux/Reducers/productSlice";
import {
  submitCheckout,
  resetCheckoutState,
} from "../Redux/Reducers/productSlice";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const PHONE_NUMBER_LENGTH = 10;
  const UNITED_STATES_COUNTRY_ID = 233;
  const UNITED_STATES_COUNTRY_CODE = "US";
  const UNITED_STATES_COUNTRY_NAME = "United States";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  const { cart, cartLoading } = useSelector((state) => state.products);
  const {
    checkoutLoading: submitting,
    checkoutSuccess: success,
  } = useSelector((state) => state.products);

  const [pageLoading, setPageLoading] = useState(true);
  const [selectedCountryId] = useState(UNITED_STATES_COUNTRY_ID);
  const [selectedState, setSelectedState] = useState(null);
  const [useStateAsCity, setUseStateAsCity] = useState(false);
  const [paymentMethodError, setPaymentMethodError] = useState("");
  const stripePaymentFormRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    setTimeout(() => {
      setPageLoading(false);
    }, 500);

    dispatch(getCart());

    return () => {
      dispatch(resetCheckoutState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      navigate("/thank-you", {});
    }
  }, [success, navigate]);

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, PHONE_NUMBER_LENGTH);

    if (digits.length <= 3) {
      return digits.length ? `(${digits}` : "";
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const formatStateCode = (value) =>
    value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: UNITED_STATES_COUNTRY_CODE,
      zip_code: "",
      notes: "",
      agree_terms: false,
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("First name is required"),
      last_name: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string()
        .required("Phone number is required")
        .matches(
          /^\(\d{3}\) \d{3}-\d{4}$/,
          "Phone number must be in (123) 456-7890 format",
        ),
      address: Yup.string().required("Address is required"),
      city: useStateAsCity
        ? Yup.string()
        : Yup.string().required("City is required"),
      state: Yup.string()
        .required("State is required")
        .matches(
          /^[A-Z]{2,3}$/,
          "Enter state abbreviation only, e.g. CA, NY, TX",
        ),
      country: Yup.string().required("Country is required"),
      zip_code: Yup.string().required("ZIP code is required"),
      agree_terms: Yup.boolean().oneOf([true], "You must agree to the terms"),
    }),
    onSubmit: async (values) => {
      await handleSubmitCheckout(values);
    },
  });

  const cartItems = Array.isArray(cart)
    ? cart
    : cart?.cart_items
      ? cart.cart_items
      : [];

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + getProductPrice(item), 0);
  };

  const handleSubmitCheckout = async (formValues) => {
    try {
      setPaymentMethodError("");

      if (!stripePaymentFormRef.current) {
        throw new Error("Stripe card form is still loading.");
      }

      const paymentMethod = await stripePaymentFormRef.current.createPaymentMethod({
          name: `${formValues.first_name} ${formValues.last_name}`.trim(),
          email: formValues.email,
          phone: formValues.phone,
          address: {
            line1: formValues.address,
            city: formValues.city === "-" ? undefined : formValues.city,
            state: formValues.state,
            country: UNITED_STATES_COUNTRY_CODE,
            postal_code: formValues.zip_code,
          },
      });

      console.log("Stripe PaymentMethod ID:", paymentMethod.id);

      const checkoutData = {
        user_id: userId || localStorage.getItem("cart_user_id"),
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        email: formValues.email,
        phone: formValues.phone,
        address: formValues.address,
        city: formValues.city,
        state: formValues.state,
        country: UNITED_STATES_COUNTRY_CODE,
        zip_code: formValues.zip_code,
        notes: formValues.notes || "",
        agree_terms: formValues.agree_terms,
        payment_method_id: paymentMethod.id,
        cart_items: cartItems.map((item) => {
          if (item.items && Array.isArray(item.items)) {
            return {
              group_uuid: item.group_uuid,
              items: item.items.map((nestedItem) => ({
                id: nestedItem.id,
                product_id: nestedItem.product_id,
                product_variant_id: nestedItem.product_variant_id,
                quantity: nestedItem.quantity,
                buy_type: nestedItem.buy_type,
                price: getProductPrice(nestedItem),
                waist_measurement: nestedItem.waist_measurement,
                outseam_measurement: nestedItem.outseam_measurement,
              })),
            };
          }

          return {
            id: item.id,
            product_id: item.product_id,
            product_variant_id: item.product_variant_id,
            quantity: item.quantity,
            buy_type: item.buy_type,
            price: getProductPrice(item),
            waist_measurement: item.waist_measurement,
            outseam_measurement: item.outseam_measurement,
          };
        }),
        total_amount: calculateTotal(),
      };

      await dispatch(submitCheckout(checkoutData)).unwrap();
      navigate("/thank-you");
    } catch (checkoutError) {
      console.error("Checkout failed:", checkoutError);
      setPaymentMethodError(
        checkoutError?.message || "Unable to create Stripe payment method.",
      );
    }
  };

  const normalizeColorText = (value) =>
    value?.toString().toLowerCase().replace(/[^a-z0-9]/g, "") || "";

  const getProductImage = (item) => {
    const displayItem = item.items?.length ? item.items[0] : item;
    const product = displayItem?.product || item.product;
    const itemColorValues = [
      displayItem?.color,
      displayItem?.color_code,
      item?.color,
      item?.color_code,
    ]
      .map(normalizeColorText)
      .filter(Boolean);

    if (product?.images?.length && itemColorValues.length) {
      const matchedImage = product.images.find((img) => {
        const imageColorValues = [
          img.color,
          img.color_name,
          img.color_key,
          img.name,
          img.alt,
          img.title,
          img.image_url,
        ]
          .map(normalizeColorText)
          .filter(Boolean);

        return itemColorValues.some((colorValue) =>
          imageColorValues.some((imageValue) => imageValue.includes(colorValue)),
        );
      });

      if (matchedImage?.image_url) return matchedImage.image_url;
    }

    if (product?.primary_image_url) return product.primary_image_url;
    if (product?.images && product.images.length > 0) {
      const primaryImage = product.images.find((img) => img.is_primary === true);
      if (primaryImage?.image_url) return primaryImage.image_url;
      return product.images[0].image_url;
    }
    return "/Images/suit1.png";
  };

  const getProductDisplayName = (item) => {
    if (item.items && Array.isArray(item.items) && item.items.length > 0) {
      return item.product?.name || "Suit";
    }
    return item.product?.name || "Product";
  };

  const getProductDisplayType = (item) => {
    const displayItem = item.items?.length ? item.items[0] : item;

    if (
      displayItem?.override_price !== null &&
      displayItem?.override_price !== undefined &&
      parseFloat(displayItem.override_price) === 0
    ) {
      return "rent";
    }

    return displayItem?.buy_type || "rent";
  };

  const getProductColor = (item) => {
    const displayItem = item.items?.length ? item.items[0] : item;
    return displayItem?.color || displayItem?.color_code || "";
  };

  const getPantMeasurementDetails = (item) => {
    const pantItem = item.items?.length
      ? item.items.find((nestedItem) => nestedItem.size_category === "pants")
      : item.size_category === "pants"
        ? item
        : null;

    if (!pantItem?.waist_measurement && !pantItem?.outseam_measurement) {
      return "";
    }

    return [
      pantItem.waist_measurement && `Waist: ${pantItem.waist_measurement}`,
      pantItem.outseam_measurement && `Outseam: ${pantItem.outseam_measurement}`,
    ]
      .filter(Boolean)
      .join(" | ");
  };

  const getSingleItemPrice = (item) => {
    if (item?.override_price !== null && item?.override_price !== undefined) {
      return parseFloat(item.override_price) || 0;
    }

    const product = item?.product;
    const buyType = item?.buy_type;

    if (buyType === "buy") {
      return parseFloat(product?.buy_price) || 0;
    }

    if (buyType === "rent") {
      return parseFloat(product?.rent_price) || 0;
    }

    return 0;
  };

  const getProductPrice = (item) => {
    if (item.items && Array.isArray(item.items) && item.items.length > 0) {
      return item.items.reduce((sum, nestedItem) => {
        const quantity = nestedItem?.quantity || 1;
        return sum + getSingleItemPrice(nestedItem) * quantity;
      }, 0);
    }

    return getSingleItemPrice(item) * (item.quantity || 1);
  };

  const getProductQuantity = (item) => {
    if (item.items && item.items.length > 0) {
      return item.items[0]?.quantity || 1;
    }
    return item.quantity || 1;
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return "$0.00";
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getFieldError = (fieldName) => {
    return formik.touched[fieldName] && formik.errors[fieldName] ? (
      <div className="error-message">{formik.errors[fieldName]}</div>
    ) : null;
  };

  const handleStateChange = (value) => {
    setSelectedState(null);
    setUseStateAsCity(false);
    formik.setFieldValue("state", formatStateCode(value || ""));
  };

  if (pageLoading || cartLoading) {
    return (
      <div className="checkout-page">
        <Header />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page product-detail-page">
      <Header />

      <div className="container">
        <form onSubmit={formik.handleSubmit}>
          <div className="row checkout-row">
            <div className="checkout-left col-md-8" data-aos="fade-right">
              <div className="contact-field">
                <h3>Contact information</h3>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    className={`input ${formik.touched.email && formik.errors.email ? "error" : ""}`}
                    placeholder="Email address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {getFieldError("email")}
                </div>
              </div>

              <h3>Billing address</h3>

              <div className="select-field">
                <input
                  type="text"
                  name="country"
                  className={`input  ${formik.touched.country && formik.errors.country ? "error" : ""}`}
                  value={UNITED_STATES_COUNTRY_NAME}
                  disabled
                  readOnly
                />
                {getFieldError("country")}
              </div>

              <div className="row-fields">
                <div className="select-field">
                  <input
                    type="text"
                    name="state"
                    className={`input ${formik.touched.state && formik.errors.state ? "error" : ""}`}
                    placeholder="State (CA, TX, NY, etc.)"
                    maxLength={3}
                    value={formik.values.state}
                    onChange={(e) => {
                      handleStateChange(e.target.value);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {getFieldError("state")}
                </div>

                <div className="select-field">
                  <input
                    type="text"
                    name="city"
                    className={`input ${formik.touched.city && formik.errors.city ? "error" : ""}`}
                    placeholder="City"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {getFieldError("city")}
                </div>
              </div>

              <div className="row-fields">
                <div className="field">
                  <input
                    type="text"
                    name="first_name"
                    className={`input ${formik.touched.first_name && formik.errors.first_name ? "error" : ""}`}
                    placeholder="First name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {getFieldError("first_name")}
                </div>
                <div className="field">
                  <input
                    type="text"
                    name="last_name"
                    className={`input ${formik.touched.last_name && formik.errors.last_name ? "error" : ""}`}
                    placeholder="Last name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {getFieldError("last_name")}
                </div>
              </div>

              <div className="row-fields">
                <div className="field">
                  <input
                    type="text"
                    name="zip_code"
                    className={`input ${formik.touched.zip_code && formik.errors.zip_code ? "error" : ""}`}
                    placeholder="ZIP Code"
                    value={formik.values.zip_code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {getFieldError("zip_code")}
                </div>
                <div className="field">
                  <input
                    className={`input ${formik.touched.phone && formik.errors.phone ? "error" : ""}`}
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    inputMode="numeric"
                    maxLength={14}
                    value={formik.values.phone}
                    onChange={(e) =>
                      formik.setFieldValue("phone", formatPhoneNumber(e.target.value))
                    }
                    onBlur={formik.handleBlur}
                  />
                  {getFieldError("phone")}
                </div>
              </div>

              <div className="row-fields">
                <div className="field">
                  <input
                    type="text"
                    name="address"
                    className={`input ${formik.touched.address && formik.errors.address ? "error" : ""}`}
                    placeholder="Address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {getFieldError("address")}
                </div>
              </div>

              <div className="row-fields">
                <div className="field">
                  <textarea
                    name="notes"
                    className="input"
                    placeholder="Order notes (optional)"
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    rows="3"
                  />
                </div>
              </div>

              <h3>Payment options</h3>

              <div className="stripe-payment-wrapper">
                <Elements stripe={stripePromise}>
                  <StripePaymentForm ref={stripePaymentFormRef} />
                </Elements>
                {paymentMethodError && (
                  <div className="payment-message error">
                    {paymentMethodError}
                  </div>
                )}
              </div>

              <div className="terms-checkbox">
                <div>
                  <input
                    type="checkbox"
                    name="agree_terms"
                    id="agreeTerms"
                    checked={formik.values.agree_terms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="agreeTerms">
                    I agree to the <Link to="/terms-and-conditions">Terms and Conditions</Link> and <Link to="/privacy-policy">Privacy Policy</Link>
                  </label>
                </div>
                {getFieldError("agree_terms")}
              </div>

              <div className="buttons">
                <a href="/cart">
                  <i className="fa-solid fa-arrow-left-long"></i> Return to Cart
                </a>
                <button
                  type="submit"
                  className="designBtn2"
                  disabled={submitting}
                  style={{
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? "SUBMITTING..." : "PLACE ORDER"}
                </button>
              </div>
            </div>

            <div className="checkout-right col-md-4" data-aos="fade-left">
              <div className="summary-box">
                <h3>Order summary</h3>

                {cartItems.length === 0 ? (
                  <p>Your cart is empty</p>
                ) : (
                  cartItems.map((item) => (
                    <div className="summary-item" key={item.id}>
                      <div className="summary-info-image">
                        <img
                          src={getProductImage(item)}
                          onError={(e) => {
                            e.target.src = "/Images/suit1.png";
                          }}
                        />
                      </div>
                      <div className="summary-info">
                        <div className="summary-info-title">
                          <h4>
                            {getProductDisplayName(item)}
                            {item.items && item.items.length > 0 && (
                              <span className="suit-badge"> (Suit)</span>
                            )}
                          </h4>
                          <span className="summary-price">
                            {formatPrice(getProductPrice(item))}
                            {getProductColor(item) && ` | Color: ${getProductColor(item)}`}
                          </span>
                          <p className="item-quantity">
                            Qty: {getProductQuantity(item)}
                          </p>
                          {getPantMeasurementDetails(item) && (
                            <p>{getPantMeasurementDetails(item)}</p>
                          )}
                        </div>
                        <div className="summary-info-type">
                          <p className="item-type">
                            {getProductDisplayType(item) === "buy" ? "Buy" : "Rent"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <div className="summary-row total">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
