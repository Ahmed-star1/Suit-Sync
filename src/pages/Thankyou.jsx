import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const dispatch = useDispatch();

  const { orderSummary, orderSummaryLoading } = useSelector(
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

  const getOrderStatus = (status) => {
    if (!status) return "";

    const normalizedStatus = status.toString().trim().toLowerCase();

    if (normalizedStatus === "delivered") {
      return "Shipped";
    }

    return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
  };

  // Format price
  const formatPrice = (price) => {
    if (!price && price !== 0) return "$0.00";
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Get product image
  const normalizeColorText = (value) =>
    value?.toString().toLowerCase().replace(/[^a-z0-9]/g, "") || "";

  const getProductImage = (item) => {
    const sourceItem = getDisplaySourceItem(item);
    const itemColorValues = [
      sourceItem.color,
      sourceItem.color_code,
      item.color,
      item.color_code,
    ]
      .map(normalizeColorText)
      .filter(Boolean);

    const productImages =
      sourceItem.images ||
      item.images ||
      sourceItem.product?.images ||
      item.product?.images ||
      [];
    if (productImages.length && itemColorValues.length) {
      const matchedImage = productImages.find((img) => {
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

    if (item.image_url) {
      return item.image_url;
    }
    return "/Images/suit1.png";
  };

  // Get buy type label
  const getBuyTypeLabel = (item) => {
    const sourceItem = getDisplaySourceItem(item);
    const totalPrice = sourceItem.total_price ?? item.total_price;

    if (
      totalPrice !== null &&
      totalPrice !== undefined &&
      parseFloat(totalPrice) === 0
    ) {
      return "Rent";
    }

    const buyType =
      sourceItem.buy_type ||
      sourceItem.type ||
      sourceItem.product?.buy_type ||
      item.buy_type ||
      item.type ||
      item.product?.buy_type;

    if (buyType === "rent") return "Rent";
    if (buyType === "buy") return "Buy";
    return "Rent";
  };

  const getDisplaySourceItem = (item) => {
    return item.items?.[0] || item;
  };

  const getProductSku = (item) => {
    const sourceItem = getDisplaySourceItem(item);

    return (
      sourceItem.sku ||
      sourceItem.product_sku ||
      sourceItem.product?.sku ||
      sourceItem.variant?.sku ||
      ""
    );
  };

  const getProductStyle = (item) => {
    const sourceItem = getDisplaySourceItem(item);
    const buyType = (
      sourceItem.buy_type ||
      sourceItem.type ||
      sourceItem.product?.buy_type ||
      ""
    ).toLowerCase();

    if (buyType === "buy") {
      return (
        sourceItem.product_buy_style ||
        sourceItem.buy_style ||
        sourceItem.product?.buy_style ||
        ""
      );
    }

    if (buyType === "rent") {
      return (
        sourceItem.product_rent_style ||
        sourceItem.rent_style ||
        sourceItem.product?.rent_style ||
        ""
      );
    }

    return (
      sourceItem.product_buy_style ||
      sourceItem.product_rent_style ||
      sourceItem.buy_style ||
      sourceItem.rent_style ||
      ""
    );
  };

  const getProductStyleLabel = (item) => {
    const sourceItem = getDisplaySourceItem(item);
    const buyType = (
      sourceItem.buy_type ||
      sourceItem.type ||
      sourceItem.product?.buy_type ||
      ""
    ).toLowerCase();

    if (
      buyType === "buy" ||
      sourceItem.product_buy_style ||
      sourceItem.buy_style ||
      sourceItem.product?.buy_style
    ) {
      return "Buy Style";
    }

    if (
      buyType === "rent" ||
      sourceItem.product_rent_style ||
      sourceItem.rent_style ||
      sourceItem.product?.rent_style
    ) {
      return "Rent Style";
    }

    return "Style";
  };

  const getProductColor = (item) => {
    const sourceItem = getDisplaySourceItem(item);
    return sourceItem.color || sourceItem.color_code || "";
  };

  const getProductEventDate = (item) => {
    const sourceItem = getDisplaySourceItem(item);
    return (
      sourceItem.event_date ||
      sourceItem.event?.date ||
      sourceItem.date ||
      item.event_date ||
      item.event?.date ||
      item.date ||
      ""
    );
  };

  const getProductEventName = (item) => {
    const sourceItem = getDisplaySourceItem(item);
    return (
      sourceItem.event_name ||
      sourceItem.event?.name ||
      item.event_name ||
      item.event?.name ||
      ""
    );
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

  const groupedItems = () => {
    if (!order?.items) return [];

    const groups = {};
    const standaloneItems = [];

    order.items.forEach((item) => {
      if (item.group_uuid) {
        if (!groups[item.group_uuid]) {
          const firstVariant = item.variants?.[0];
          const itemQuantity = firstVariant?.quantity || item.quantity || 1;
          
          groups[item.group_uuid] = {
            group_uuid: item.group_uuid,
            product_name: item.product_name || "Suit",
            items: [],
            quantity: itemQuantity, 
            total_price: 0,
          };
        }
        groups[item.group_uuid].items.push(item);
        groups[item.group_uuid].total_price += item.total_price || item.unit_price * item.quantity || 0;
      } else {
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

 const getProductSize = (item) => {
  if (item.items && item.items.length > 0) {
    const sizes = item.items.map(nestedItem => {
      if (nestedItem.size) return nestedItem.size;
      if (nestedItem.variants && nestedItem.variants.length > 0) {
        return nestedItem.variants.map(v => v.size).filter(s => s).join(', ');
      }
      if (nestedItem.main_size) return nestedItem.main_size;
      return null;
    }).filter(s => s);
    
    return sizes.length > 0 ? sizes.join(' + ') : '';
  }
  
  // 2️⃣ For Shoes & Single Products (direct size field on item)
  if (item.size) {
    return item.size;
  }
  
  // 3️⃣ For products with variants array
  if (item.variants && item.variants.length > 0) {
    const sizes = item.variants.map(v => v.size).filter(s => s);
    if (sizes.length > 0) return sizes.join(', ');
  }
  
  // 4️⃣ Fallback to main_size
  if (item.main_size) return item.main_size;
  
  // 5️⃣ Fallback to size_type or size_measurement
  if (item.size_type) return item.size_type;
  if (item.size_measurement) return item.size_measurement;
  
  return '';
};

const getSuitGroupSizeDetails = (item) => {
  if (!item.items || item.items.length === 0) return null;

  const sizeDetails = {
    coat: null,
    pant: null,
  };

  const normalizeText = (text) => text.toString().trim().toLowerCase();
  const isCoat = (text) => /coat|jacket/.test(text);
  const isPant = (text) => /pant|pants|trouser/.test(text);

  const extractSizeValue = (text) => {
    if (text.includes(':')) {
      return text.split(':')[1].trim();
    }
    return text;
  };

  const addSize = (text) => {
    if (!text) return;
    const normalized = normalizeText(text);
    const sizeValue = extractSizeValue(text);
    
    if (isCoat(normalized)) {
      sizeDetails.coat = sizeValue;
    } else if (isPant(normalized)) {
      sizeDetails.pant = sizeValue;
    } else if (!sizeDetails.coat) {
      sizeDetails.coat = sizeValue;
    }
  };

  item.items.forEach((nestedItem) => {
    const sizeCandidates = [];

    if (nestedItem.main_size) sizeCandidates.push(nestedItem.main_size);
    if (nestedItem.size) sizeCandidates.push(nestedItem.size);
    if (nestedItem.variants && nestedItem.variants.length > 0) {
      nestedItem.variants.forEach((variant) => {
        if (variant.size) sizeCandidates.push(variant.size);
      });
    }

    sizeCandidates.forEach((candidate) => addSize(candidate));

    if (!nestedItem.main_size && !nestedItem.size && nestedItem.product_name) {
      addSize(nestedItem.product_name);
    }
  });

  // Return object with coat and pant separately
  return {
    coat: sizeDetails.coat,
    pant: sizeDetails.pant
  };
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
            <div className="order-info-item">
              <span className="label">Status:</span>
              <span className="value">{getOrderStatus(order.status)}</span>
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
                    const productSku = getProductSku(item);
                    const productStyle = getProductStyle(item);
                    const productStyleLabel = getProductStyleLabel(item);
                    const productEventName = getProductEventName(item);
                    const productEventDate = getProductEventDate(item);
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
                              <strong>Qty:</strong> {item.quantity}
                              {getProductColor(item) && (
                                <> | <strong>Color:</strong> {getProductColor(item)}</>
                              )}
                            </span>
                            {productSku && (
                              <p className="item-detail">
                                SKU: {productSku}
                              </p>
                            )}
                            {productStyle && (
                              <p className="item-detail">
                                <strong>{productStyleLabel}:</strong> {productStyle}
                              </p>
                            )}
                            {(() => {
                              const sizeDetails = getSuitGroupSizeDetails(item);
                              if (!sizeDetails || (!sizeDetails.coat && !sizeDetails.pant)) return null;
                                  
                                  return (
                                    <div className="suit-sizes">
                                      {sizeDetails.coat && (
                                        <span className="item-size coat-size">
                                          <strong>Coat:</strong> {sizeDetails.coat}
                                        </span>
                                      )}
                                      <br/>
                                      {sizeDetails.pant && (
                                        <span className="item-size pant-size">
                                          <strong>Pant:</strong> {sizeDetails.pant}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })()}
                          </div>
                        </div>
                        <div className="item-price">
                          {getBuyTypeLabel(item.items[0]) === "Rent" && (productEventName || productEventDate) && (
                            <>
                              {productEventName && (
                                <div className="item-detail event-name">
                                  <strong>Event Name:</strong> {productEventName}
                                </div>
                              )}
                              {productEventDate && (
                                <div className="item-detail event-date">
                                  <strong>Event Date:</strong> {formatDate(productEventDate)}
                                </div>
                              )}
                            </>
                          )}
                          {formatPrice(item.total_price)}
                        </div>
                      </div>
                    );
                  } else {
                    const productSize = getProductSize(item);
                    const productSku = getProductSku(item);
                    const productStyle = getProductStyle(item);
                    const productStyleLabel = getProductStyleLabel(item);
                    const productEventName = getProductEventName(item);
                    const productEventDate = getProductEventDate(item);
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
                              <strong>Qty:</strong> {item.quantity || 1}
                              {getProductColor(item) && (
                                <> | <strong>Color:</strong> {getProductColor(item)}</>
                              )}
                            </span>
                            {productSku && (
                              <p className="item-detail">
                                <strong>SKU:</strong> {productSku}
                              </p>
                            )}
                            {productStyle && (
                              <p className="item-detail">
                                <strong>{productStyleLabel}:</strong> {productStyle}
                              </p>
                            )}
                            {productSize && (
                              <p className="item-size">
                                <strong>Size:</strong> {productSize}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="item-price">
                          {formatPrice(item.unit_price)}
                          {getBuyTypeLabel(item) === "Rent" && (productEventName || productEventDate) && (
                            <>
                              {productEventName && (
                                <div className="item-detail event-name">
                                  <strong>Event Name:</strong> {productEventName}
                                </div>
                              )}
                              {productEventDate && (
                                <div className="item-detail event-date">
                                  <strong>Event Date:</strong> {formatDate(productEventDate)}
                                </div>
                              )}
                            </>
                          )}
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
          {/* <button className="designBtn2" onClick={() => window.print()}>
            Print Receipt
          </button> */}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ThankYouPage;
