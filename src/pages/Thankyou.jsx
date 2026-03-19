import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../components/header";
import Footer from "../components/footer";
import Loader from "../components/Loader";
import {
  getOrderSummary,
  clearOrderSummary,
} from "../Redux/Reducers/productSlice";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { message } = location.state || {};

  const { orderSummary, orderSummaryLoading, error } = useSelector(
    (state) => state.products,
  );

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    window.scrollTo(0, 0);
    dispatch(getOrderSummary());

    return () => {
      dispatch(clearOrderSummary());
    };
  }, [dispatch]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get country name
  const getCountryName = (countryCode) => {
    const countries = {
      US: "United States",
      CA: "Canada",
      IN: "India",
      UK: "United Kingdom",
      AU: "Australia",
    };
    return countries[countryCode] || countryCode;
  };

  // Get payment method name
  const getPaymentMethod = (method) => {
    const methods = {
      card: "Credit Card",
      cash: "Cash on Delivery",
      paypal: "PayPal",
    };
    return methods[method] || method;
  };

  // Format price
  const formatPrice = (price) => {
    if (!price && price !== 0) return "$0.00";
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Get product image
  const getProductImage = (item) => {
    if (item.image) {
      return item.image;
    }

    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      const featuredImage = item.images.find((img) => img.is_featured === true);
      if (featuredImage?.image_url) {
        return featuredImage.image_url;
      }
      return item.images[0].image_url;
    }

    if (item.product?.images && Array.isArray(item.product.images)) {
      const featuredImage = item.product.images.find(
        (img) => img.is_featured === true,
      );
      if (featuredImage?.image_url) {
        return featuredImage.image_url;
      }
      return item.product.images[0]?.image_url;
    }

    return "/Images/suit1.png";
  };

  // Get buy type label
  const getBuyTypeLabel = (item) => {
    const buyType = item.buy_type || item.type || item.product?.buy_type;

    if (buyType === "rent") return "Rent";
    if (buyType === "buy") return "Buy";
    return "Rent";
  };

  // Extract order from API response
  const getOrder = () => {
    if (!orderSummary) return null;

    const data = orderSummary.data || orderSummary;

    if (data.orders && data.orders.length > 0) {
      return data.orders[0];
    }

    return null;
  };

  // Get total summary
  const getTotalSummary = () => {
    if (!orderSummary) return null;

    const data = orderSummary.data || orderSummary;
    return data.total_summary || null;
  };

  const order = getOrder();
  const totalSummary = getTotalSummary();

  // ✅ ONLY CHANGED: Sirf quantity set ki hai, UI bilkul same hai
  const groupedItems = () => {
    if (!order?.items) return [];

    const groups = {};
    const standaloneItems = [];

    order.items.forEach((item) => {
      if (item.group_uuid) {
        // Suit item
        if (!groups[item.group_uuid]) {
          groups[item.group_uuid] = {
            group_uuid: item.group_uuid,
            product_name: item.product_name || "Suit",
            items: [],
            quantity: 1, // ✅ Sirf quantity 1 set ki
            total_price: 0,
          };
        }
        groups[item.group_uuid].items.push(item);
        groups[item.group_uuid].total_price += item.total_price || item.unit_price * item.quantity || 0;
      } else {
        // Regular item
        standaloneItems.push(item);
      }
    });

    const groupedSuits = Object.values(groups);
    return [...groupedSuits, ...standaloneItems];
  };

  const displayItems = groupedItems();

  // Check if item is a suit group
  const isSuitGroup = (item) => {
    return item.items && Array.isArray(item.items);
  };

  // Calculate totals
  const calculateItemTotal = () => {
    if (!order?.items) return 0;
    
    let total = 0;
    
    displayItems.forEach((item) => {
      if (isSuitGroup(item)) {
        total += item.total_price;
      } else {
        total += item.total_price || item.unit_price * item.quantity || 0;
      }
    });
    
    return total;
  };

  const subtotal =
    order?.summary?.subtotal || totalSummary?.subtotal || calculateItemTotal();
  const total =
    order?.summary?.total_amount || totalSummary?.total_amount || subtotal;

  if (orderSummaryLoading) {
    return (
      <div className="thankyou-page">
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

  if (!order) {
    return (
      <div className="thankyou-page">
        <Header />
        <div className="thankyou-container container">
          <div className="thankyou-header error-state">
            <div className="error-icon">!</div>
            <h2>Order Not Found</h2>
            <p>We couldn't find your order information.</p>
            <button className="designBtn2" onClick={() => navigate("/shop")}>
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="thankyou-page">
      <Header />

      <div className="thankyou-container container">
        <div className="thankyou-header" data-aos="zoom-in">
          <div className="success-animation">
            <svg
              className="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
          <h2>Thank You for Your Order!</h2>
          <p>Your order has been placed successfully.</p>

          <div className="order-info-badge">
            <div className="order-info-item">
              <span className="label">Order Number:</span>
              <span className="value">{order.order_number}</span>
            </div>
            <div className="order-info-item">
              <span className="label">Order Date:</span>
              <span className="value">{formatDate(order.created_at)}</span>
            </div>
          </div>
        </div>

        <div
          className="order-details-card"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="card-header">
            <div className="header-left">
              <span className="order-id">Order #{order.order_number}</span>
              <span className="payment-method">
                {getPaymentMethod(order.payment_method)}
              </span>
            </div>
          </div>

          <div className="details-grid">
            <div className="items-section">
              <h3 className="section-title">
                Order Items ({displayItems.length})
              </h3>
              <div className="items-list">
                {displayItems.map((item, index) => {
                  if (isSuitGroup(item)) {
                    return (
                      <div
                        className="list-item with-image"
                        key={item.group_uuid || index}
                      >
                        <div className="item-image">
                          <img
                            src={getProductImage(item.items[0])}
                            alt={item.product_name}
                            onError={(e) => {
                              e.target.src = "/Images/suit1.png";
                            }}
                          />
                        </div>

                        <div className="item-info">
                          <div className="item-name-wrapper">
                            <span className="item-name">{item.product_name}</span>
                            <span className="item-badge">
                              {getBuyTypeLabel(item.items[0])}
                            </span>
                          </div>
                          <div className="item-meta">
                            <span className="item-quantity">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="item-price">
                          {formatPrice(item.total_price)}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        className="list-item with-image"
                        key={item.id || index}
                      >
                        <div className="item-image">
                          <img
                            src={getProductImage(item)}
                            alt={item.product_name}
                            onError={(e) => {
                              e.target.src = "/Images/suit1.png";
                            }}
                          />
                        </div>

                        <div className="item-info">
                          <div className="item-name-wrapper">
                            <span className="item-name">{item.product_name}</span>
                            <span className="item-badge">
                              {getBuyTypeLabel(item)}
                            </span>
                          </div>
                          <div className="item-meta">
                            <span className="item-quantity">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="item-price">
                          {formatPrice(item.unit_price)}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>

              <div className="price-breakdown">
                <div className="breakdown-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="breakdown-row shipping">
                  <span>Shipping</span>
                  <span className="free">FREE</span>
                </div>
                <div className="breakdown-row total">
                  <span>Total</span>
                  <span className="total-amount">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              {order.shipping_address && (
                <div className="info-block">
                  <h3 className="section-title">Shipping Address</h3>
                  <div className="address-block">
                    <p>
                      <strong>Name:</strong> {order.shipping_address.first_name}{" "}
                      {order.shipping_address.last_name}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.shipping_address.address}
                    </p>
                    <p>
                      <strong>City:</strong> {order.shipping_address.city}
                    </p>
                    <p>
                      <strong>State:</strong> {order.shipping_address.state}
                    </p>
                    <p>
                      <strong>Zip Code:</strong>{" "}
                      {order.shipping_address.zip_code}
                    </p>
                    <p>
                      <strong>Country:</strong>{" "}
                      {getCountryName(order.shipping_address.country)}
                    </p>
                  </div>
                </div>
              )}

              {order.shipping_address && (
                <div className="info-block">
                  <h3 className="section-title">
                    Contact Information
                  </h3>
                  <div className="contact-block">
                    <p>
                      <strong>Email:</strong>{" "}
                      <a href={`mailto:${order.shipping_address.email}`}>
                        {order.shipping_address.email}
                      </a>
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      <a href={`tel:${order.shipping_address.phone}`}>
                        {order.shipping_address.phone}
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="buttons-row" data-aos="fade-up" data-aos-delay="300">
          <button className="designBtn2" onClick={() => navigate("/shop")}>
            Continue Shopping
          </button>
          <button className="designBtn2" onClick={() => window.print()}>
            Print Receipt
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ThankYouPage;