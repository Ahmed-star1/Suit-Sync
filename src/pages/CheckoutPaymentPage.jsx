import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/header";
import Footer from "../components/footer";
import Loader from "../components/Loader";
import StripePaymentForm from "../components/StripePaymentForm";
import {
  getCart,
  resetCheckoutState,
  submitCheckout,
} from "../Redux/Reducers/productSlice";
import {
  getCheckoutBillingDetails,
  getCheckoutTaxDetails,
} from "../Redux/Utils/localStore";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const UNITED_STATES_COUNTRY_CODE = "US";

const CheckoutPaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const stripePaymentFormRef = useRef(null);

  const { userId } = location.state || {};
  const { cart, cartLoading, checkoutLoading: submitting } = useSelector(
    (state) => state.products,
  );

  const billingDetails = getCheckoutBillingDetails();
  const taxDetails = getCheckoutTaxDetails();
  const [pageLoading, setPageLoading] = useState(true);
  const [paymentMethodError, setPaymentMethodError] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
    dispatch(getCart());

    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      dispatch(resetCheckoutState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!billingDetails) {
      navigate("/Checkout");
    }
  }, [billingDetails, navigate]);

  const cartItems = Array.isArray(cart)
    ? cart
    : cart?.cart_items
      ? cart.cart_items
      : [];

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

    if (buyType === "buy") return parseFloat(product?.buy_price) || 0;
    if (buyType === "rent") return parseFloat(product?.rent_price) || 0;
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

  const calculateSubtotal = () =>
    cartItems.reduce((sum, item) => sum + getProductPrice(item), 0);

  const calculateTax = () => parseFloat(taxDetails?.tax_amount) || 0;
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const formatPrice = (price) => {
    if (!price || price === 0) return "$0.00";
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const buildCartItemsPayload = () =>
    cartItems.map((item) => {
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
    });

  const handleSubmitCheckout = async (event) => {
    event.preventDefault();

    try {
      setPaymentMethodError("");

      if (!stripePaymentFormRef.current) {
        throw new Error("Stripe card form is still loading.");
      }

      const paymentMethod = await stripePaymentFormRef.current.createPaymentMethod({
        name: `${billingDetails.first_name} ${billingDetails.last_name}`.trim(),
        email: billingDetails.email,
        phone: billingDetails.phone,
        address: {
          line1: billingDetails.address,
          city: billingDetails.city === "-" ? undefined : billingDetails.city,
          state: billingDetails.state,
          country: UNITED_STATES_COUNTRY_CODE,
          postal_code: billingDetails.zip_code,
        },
      });

      const storedBillingDetails = getCheckoutBillingDetails();
      const storedTaxDetails = getCheckoutTaxDetails();

      if (!storedBillingDetails) {
        navigate("/Checkout");
        return;
      }

      const checkoutData = {
        user_id:
          storedBillingDetails.user_id ||
          userId ||
          localStorage.getItem("cart_user_id"),
        first_name: storedBillingDetails.first_name,
        last_name: storedBillingDetails.last_name,
        email: storedBillingDetails.email,
        phone: storedBillingDetails.phone,
        address: storedBillingDetails.address,
        city: storedBillingDetails.city,
        state: storedBillingDetails.state,
        country: UNITED_STATES_COUNTRY_CODE,
        zip_code: storedBillingDetails.zip_code,
        notes: storedBillingDetails.notes || "",
        agree_terms: storedBillingDetails.agree_terms,
        payment_method_id: paymentMethod.id,
        tax_calculation_id: storedTaxDetails?.tax_calculation_id || "",
        cart_items: buildCartItemsPayload(),
        total_amount: calculateTotal(),
      };

      await dispatch(submitCheckout(checkoutData)).unwrap();
      navigate("/thank-you");
    } catch (checkoutError) {
      setPaymentMethodError(
        checkoutError?.message || "Unable to create Stripe payment method.",
      );
    }
  };

  if (!billingDetails || pageLoading || cartLoading) {
    return (
      <div className="checkout-page checkout-payment-page">
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
    <div className="checkout-page checkout-payment-page product-detail-page">
      <Header />

      <div className="container">
        <form onSubmit={handleSubmitCheckout}>
          <div className="row checkout-row">
            <div className="checkout-left col-md-8" data-aos="fade-right">
              <h3>Checkout details</h3>

              <div className="checkout-details-panel">
                <div className="checkout-detail-row">
                  <span>Name</span>
                  <strong>
                    {billingDetails.first_name} {billingDetails.last_name}
                  </strong>
                </div>
                <div className="checkout-detail-row">
                  <span>Email</span>
                  <strong>{billingDetails.email}</strong>
                </div>
                <div className="checkout-detail-row">
                  <span>Phone</span>
                  <strong>{billingDetails.phone}</strong>
                </div>
                <div className="checkout-detail-row">
                  <span>Address</span>
                  <strong>
                    {billingDetails.address}, {billingDetails.city},{" "}
                    {billingDetails.state} {billingDetails.zip_code}
                  </strong>
                </div>
                {billingDetails.notes && (
                  <div className="checkout-detail-row">
                    <span>Notes</span>
                    <strong>{billingDetails.notes}</strong>
                  </div>
                )}
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

              <div className="buttons">
                <Link to="/Checkout">
                  <i className="fa-solid fa-arrow-left-long"></i> Return to Billing
                </Link>
                <button
                  type="submit"
                  className="designBtn2"
                  disabled={submitting}
                  style={{
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? "not-allowed" : "pointer",
                  }}
                >
                  {submitting ? "SUBMITTING..." : "PROCEED TO CHECKOUT"}
                </button>
              </div>
            </div>

            <div className="checkout-right col-md-4" data-aos="fade-left">
              <div className="summary-box">
                <h3>Order summary</h3>

                {cartItems.length === 0 ? (
                  <p className="empty-summary">Your cart is empty</p>
                ) : (
                  cartItems.map((item) => (
                    <div className="summary-item" key={item.id || item.group_uuid}>
                      <div className="summary-info-image">
                        <img
                          src={getProductImage(item)}
                          alt={getProductDisplayName(item)}
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

                <div className="payment-summary-table">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="summary-row">
                    <span>Sales Tax</span>
                    <span>{formatPrice(calculateTax())}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
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

export default CheckoutPaymentPage;
