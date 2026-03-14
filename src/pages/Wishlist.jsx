import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import AboutImage from "/Images/AboutBanner.png";
import { getWishlist, clearWishlist } from "../Redux/Reducers/productSlice";
import Loader from "../components/Loader";
import InnerBanner from "../components/InnerBanner";
import Header from "../components/header";
import Footer from "../components/footer";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlist, wishlistLoading, error } = useSelector((state) => ({
    wishlist: state.products.wishlist || [],
    wishlistLoading: state.products.wishlistLoading,
    error: state.products.error,
  }));

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    dispatch(getWishlist());

    return () => {
      dispatch(clearWishlist());
    };
  }, [dispatch]);

  const handleProductClick = (productId) => {
    navigate(`/shop/product/${productId}`);
  };

  const getPrimaryImageUrl = (product) => {
    if (!product) return "/Images/suit1.png";
    
    if (product.primary_image_url) {
      return product.primary_image_url;
    }

    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(
        (img) => img.is_primary === true,
      );
      if (primaryImage && primaryImage.image_url) {
        return primaryImage.image_url;
      }
      if (product.images[0] && product.images[0].image_url) {
        return product.images[0].image_url;
      }
    }

    return "/Images/suit1.png";
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === 0) {
      return "N/A";
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice === 0) {
      return "N/A";
    }
    return `$${numPrice}`;
  };

  const getWishlistItems = () => {
    if (Array.isArray(wishlist)) {
      return wishlist;
    }

    if (wishlist && wishlist.wishlist && Array.isArray(wishlist.wishlist)) {
      return wishlist.wishlist.map((item) => {
        if (item.product) {
          return {
            ...item.product,
            wishlist_id: item.wishlist_id,
            added_at: item.added_at,
          };
        }
        return item;
      });
    }

    if (wishlist && wishlist.count > 0 && wishlist.wishlist) {
      return wishlist.wishlist.map((item) => {
        if (item.product) {
          return {
            ...item.product,
            wishlist_id: item.wishlist_id,
            added_at: item.added_at,
          };
        }
        return item;
      });
    }

    return [];
  };

  const wishlistItems = getWishlistItems();

  return (
    <>
      <div className="wishlist-page shop-page">
        <Header />
        <InnerBanner title="Wishlist" background={AboutImage} />
        <section className="wishlist-section">
          <div className="container">
            {wishlistLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "400px",
                }}
              >
                <Loader />
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="empty-wishlist">
                <i className="fa-solid fa-face-frown"></i>
                <h2>Your wishlist is empty</h2>
                <p>
                  Save your favorite items to your wishlist and they'll appear
                  here
                </p>
                <button
                  className="designBtn2"
                  onClick={() => navigate("/shop")}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {wishlistItems.map((item) => {
                  const product = item.product || item;
                  const productId = product.id || item.id;
                  const uniqueKey = item.wishlist_id || productId || Math.random();
                  
                  return (
                    <div
                      className="product-card col-md-3"
                      key={uniqueKey}
                      onClick={() => handleProductClick(productId)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={getPrimaryImageUrl(product)}
                        alt={product.name || "Product"}
                        onError={(e) => {
                          e.target.src = "/Images/suit1.png";
                        }}
                      />
                      <div className="product-content">
                        <h5>{product.name || "Product"}</h5>
                        <div className="product-price">
                          <p className="text">Starting At</p>
                          <div className="price">
                            <span>
                              Buy: {formatPrice(product.buy_price)}
                            </span>{" "}
                            <span>
                              Rent: {formatPrice(product.rent_price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Wishlist;