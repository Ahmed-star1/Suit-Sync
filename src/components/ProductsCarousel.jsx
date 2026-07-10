import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import { getFeaturedProducts, getRelatedProducts } from "../Redux/Reducers/productSlice";

const TrendingStyles = ({ type = "featured", data = [], productId = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [slidesPerView, setSlidesPerView] = useState(4);
  
  const { featuredProducts, featuredLoading, relatedProducts, relatedProductsLoading } = useSelector((state) => state.products);
  
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    
    if (type === "featured") {
      dispatch(getFeaturedProducts());
    } else if (type === "related" && productId) {
      dispatch(getRelatedProducts(productId));
    }
  }, [dispatch, type, productId]);

  useEffect(() => {
    const getCurrentSlides = () => {
      const width = window.innerWidth;
      if (width >= 1280) return 4;
      if (width >= 1024) return 3;
      if (width >= 768) return 2;
      if (width >= 480) return 1.5;
      return 1;
    };

    const updateSlidesPerView = () => setSlidesPerView(getCurrentSlides());
    updateSlidesPerView();

    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const handleDetailpage = (productId) => {
    navigate(`/shop/product/${productId}`);
  };

  const getProductImage = (product) => {
    if (product.primary_image_url) {
      return product.primary_image_url;
    }
    
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.is_primary === true);
      if (primaryImage) {
        return primaryImage.image_url;
      }
      return product.images[0].image_url;
    }
    
    return "/Images/suit1.png";
  };

  let displayData = [];
  let heading = "";
  let isLoading = false;

  if (type === "related") {
    displayData = data.length > 0 ? data : relatedProducts;
    heading = "RELATED PRODUCTS";
    isLoading = relatedProductsLoading;
  } else {
    displayData = data.length > 0 ? data : featuredProducts;
    heading = "TRENDING STYLES";
    isLoading = featuredLoading;
  }

  if (isLoading) {
    return (
      <section className="trending-wrapper" data-aos="fade-up">
        <h2>{heading}</h2>
        <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
          Loading...
        </div>
      </section>
    );
  }

  if (displayData.length === 0) {
    return null;
  }

  const showNavigation = displayData.length > slidesPerView;

  return (
    <section className="trending-wrapper" data-aos="fade-up">
      <h2>{heading}</h2>
      <div className="container">
        <Swiper
          modules={[Navigation]}
          navigation={showNavigation}
          slidesPerView={4}
          spaceBetween={30}
          loop={showNavigation}
          className="trending-swiper"
          breakpoints={{
            0: { slidesPerView: 1 },
            480: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {displayData.map((item, index) => {
            const productId = item.id || index + 1;
            const productTitle = item.name || item.title;
            const productImage = getProductImage(item) || item.image || "/Images/suit1.png";
            
            return (
              <SwiperSlide key={productId}>
                <div
                  className={`trending-card ${(item.category?.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`.trim()}
                  onClick={() => handleDetailpage(productId)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={productImage} alt={productTitle} />
                  <h3>{productTitle}</h3>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default TrendingStyles;
