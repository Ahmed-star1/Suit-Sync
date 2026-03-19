import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/header";
import Footer from "../components/footer";
import CartRelatedProducts from "../components/CartRelatedProducts";
import Loader from "../components/Loader";
import {
  getCart,
  removeCartItem,
  getCartRelatedProducts,
  updateCartItemQuantity,
} from "../Redux/Reducers/productSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [removingItems, setRemovingItems] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [refreshingCart, setRefreshingCart] = useState(false);
  const [userId, setUserId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [updatingItems, setUpdatingItems] = useState({}); // Track updating items

  const {
    cart,
    cartLoading,
    cartRelatedProducts,
    cartRelatedProductsLoading,
  } = useSelector((state) => state.products);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    fetchCartData();
    dispatch(getCartRelatedProducts());
  }, [dispatch]);

  const fetchCartData = async () => {
    try {
      const response = await dispatch(getCart()).unwrap();
      const cartItems = response?.data?.cart_items || [];

      if (cartItems.length > 0 && cartItems[0]?.user_id) {
        setUserId(cartItems[0].user_id);
      }

      const initialQuantities = {};
      cartItems.forEach((item) => {
        if (item.buy_type === "buy") {
          initialQuantities[item.id] = item.quantity || 1;
        }
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setInitialLoad(false);
    }
  };

  const removeItem = async (itemId) => {
    setRemovingItems((prev) => [...prev, itemId]);
    setRefreshingCart(true);

    try {
      await dispatch(removeCartItem(itemId)).unwrap();
      
      setQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[itemId];
        return newQuantities;
      });
      
    } catch (error) {
      console.error(error);
    } finally {
      setRemovingItems((prev) => prev.filter((id) => id !== itemId));
      setRefreshingCart(false);
    }
  };

  const handleCheckout = () => {
    const finalUserId = userId || localStorage.getItem("cart_user_id");
    navigate("/checkout", {
      state: { userId: finalUserId, cartItems },
    });
  };

  const updateQuantity = async (itemId, newQuantity, item, action) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));
    
    setQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));

    try {
      if (action === 'decrement') {
        await dispatch(removeCartItem(item.product_variant_id)).unwrap();
      } else {
        await dispatch(
          updateCartItemQuantity({ 
            itemId: item.id, 
            quantity: newQuantity 
          })
        ).unwrap();
      }

      await dispatch(getCart()).unwrap();
      
    } catch (error) {
      console.error("Error updating quantity:", error);
      setQuantities((prev) => ({ ...prev, [itemId]: item.quantity || 1 }));
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const cartItems = Array.isArray(cart)
    ? cart
    : cart?.cart_items || [];

  const getProductImage = (item) => {
    const product = item.product;
    if (product?.primary_image_url) return product.primary_image_url;
    if (product?.images?.length) {
      const primaryImage = product.images.find((img) => img.is_primary);
      return primaryImage?.image_url || product.images[0].image_url;
    }
    return "/Images/suit1.png";
  };

  const getProductPrice = (item) => {
    const product = item.product;
    const buyType = item.buy_type;

    if (item.items?.length) {
      return item.items[0]?.buy_type === "buy"
        ? product?.buy_price
        : product?.rent_price;
    }
    
    if (buyType === "buy") return product?.buy_price || 0;
    if (buyType === "rent") return product?.rent_price || 0;
    return 0;
  };

  const getProductBuyType = (item) => item.items?.length ? item.items[0]?.buy_type : item.buy_type;

  const formatPrice = (price) => {
    if (!price || price === 0) return "$0.00";
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getProductName = (item) => item.product?.name || "Product";

  const total = cartItems.reduce((sum, item) => {
    const price = getProductPrice(item);
    const quantity = quantities[item.id] || 1;
    return sum + price * quantity;
  }, 0);

  if ((initialLoad && cartLoading) || refreshingCart) {
    return (
      <div className="cart-page">
        <Header />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header />

      <div className="cart-content">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <i className="fa-solid fa-face-frown"></i>
            <h2>Your cart is empty</h2>
            <p>Add items to your cart and they'll appear here</p>
            <button className="designBtn2" onClick={() => navigate("/shop")}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="container">
              <div className="cart-row row">
                <div className="cart-left col-md-8" data-aos="fade-right">
                  <div className="cart-header">
                    <h4>PRODUCT</h4>
                    <h4>TOTAL</h4>
                  </div>

                  {cartItems.map((item) => {
                    const price = getProductPrice(item);
                    const suitItems = item.items || [];
                    const variantId = item.product_variant_id || suitItems?.[0]?.product_variant_id;
                    const isRemoving = removingItems.includes(variantId);
                    const isUpdating = updatingItems[item.id];

                    return (
                      <div
                        className={`cart-item ${isRemoving ? "removing" : ""}`}
                        key={item.id}
                        style={{ opacity: isRemoving ? 0.5 : 1 }}
                      >
                        <div className="item-left">
                          <img
                            src={getProductImage(item)}
                            alt={getProductName(item)}
                            className="item-img"
                            onError={(e) => (e.target.src = "/Images/suit1.png")}
                          />

                          <div className="item-info">
                            <h3 className="item-title">{getProductName(item)}</h3>

                            <p className="item-price">
                              {getProductBuyType(item) === "buy" ? "Buy" : "Rent"} : {formatPrice(price)}
                            </p>

                            {getProductBuyType(item) === "buy" && (
                              <div className="qty-box">
                                <button
                                  onClick={() => updateQuantity(item.id, (quantities[item.id] || 1) - 1, item, 'decrement')}
                                  disabled={(quantities[item.id] || 1) <= 1 || isUpdating}
                                >
                                  {isUpdating ? "..." : "-"}
                                </button>
                                <span>{quantities[item.id] || 1}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, (quantities[item.id] || 1) + 1, item, 'increment')}
                                  disabled={isUpdating}
                                >
                                  {isUpdating ? "..." : "+"}
                                </button>
                              </div>
                            )}
                            <button
                              className={`remove-item ${isRemoving ? "removing-active" : ""}`}
                              onClick={() => removeItem(variantId)}
                              disabled={isRemoving}
                            >
                              {isRemoving ? <span>Removing...</span> : "Remove item"}
                            </button>
                          </div>
                        </div>

                        <div className="item-total">
                          {formatPrice(price * (quantities[item.id] || 1))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="cart-right col-md-4" data-aos="fade-left">
                  <h4 className="cart-total-title">CART TOTALS</h4>
                  <div className="cart-total-row">
                    <span>Estimated total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <button className="designBtn2" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
            <div className="cart-related-products-section" data-aos="fade-up">
              <CartRelatedProducts
                products={cartRelatedProducts}
                loading={cartRelatedProductsLoading}
              />
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;