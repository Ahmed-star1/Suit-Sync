import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const CartRelatedProducts = ({ products = [], loading = false }) => {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
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

  if (loading) {
    return (
      <section className="trending-wrapper" data-aos="fade-up">
        <h2>Related Products</h2>
        <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
          <Loader />
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="trending-wrapper" data-aos="fade-up">
      <h2>Related Products</h2>
      <div className="container">
        <Swiper
          modules={[Navigation]}
          navigation={true}
          slidesPerView={4}
          spaceBetween={30}
          loop={true}
          className="trending-swiper"
          breakpoints={{
            0: { slidesPerView: 1 },
            480: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {products.map((item) => {
            const productId = item.id;
            const productTitle = item.name || item.title;
            const productImage = getProductImage(item);
            
            return (
              <SwiperSlide key={productId}>
                <div
                  className="trending-card"
                  onClick={() => handleProductClick(productId)}
                  style={{ cursor: "pointer" }}
                >
                  <img 
                    src={productImage} 
                    alt={productTitle}
                    onError={(e) => {
                      e.target.src = "/Images/suit1.png";
                    }}
                  />
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

export default CartRelatedProducts;