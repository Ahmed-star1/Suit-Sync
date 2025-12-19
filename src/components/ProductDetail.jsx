import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import SizeChartModal from "../components/SizeChartModal";

const ProductDetail = ({ product }) => {
  const navigate = useNavigate();
  const [tabState, setTabState] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || "/Images/suit1.png"
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const handleTabToggle = () => {
    setTabState(!tabState);
  };

  const handleAddToCart = () => {
    navigate("/cart");
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <section className="product-detail-container container">
      <div className="row">
        <div className="product-left-column col-md-6" data-aos="fade-right">
          <div className="main-image">
            <img src={selectedImage} alt={product.name} />
          </div>
          <div className="image-gallery swiper-container">
            <Swiper
              spaceBetween={10}
              slidesPerView={5}
              modules={[Navigation]}
              navigation
            >
              {product.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img}
                    alt={`product-${index}`}
                    onClick={() => setSelectedImage(img)}
                    className={selectedImage === img ? "active" : ""}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="product-right-column col-md-6" data-aos="fade-left">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-description">
            <h5>DESCRIPTION</h5>
            <p>{product.description}</p>
          </div>

          <div className="product-size">
            <div className="sizes">
              <h5>SIZE</h5>
              <div className="size-options">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={selectedSize === size ? "active" : ""}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="size-actions">
              <button
                className="size-chart-btn"
                onClick={() => setIsSizeModalOpen(true)}
              >
                VIEW SIZE CHART
              </button>
              <button className="measurement-btn">USE MY MEASUREMENT</button>
            </div>
          </div>

          <div className="product-color">
            <h5>COLOR</h5>
            <div className="color-options">
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  className={`color-option ${
                    selectedColor === color.name ? "active" : ""
                  }`}
                  onClick={() => setSelectedColor(color.name)}
                >
                  <div
                    className="color-swatch"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <span className="color-name">{color.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="product-prices">
            <h5>Select Price</h5>
            <div className="prices">
              <div className="price-option">
                <span className="price-label">BUY</span>
                <span className="price-value">{product.buyPrice}</span>
              </div>
              <div className="price-option">
                <span className="price-label">RENT</span>
                <span className="price-value">{product.rentPrice}</span>
              </div>
            </div>
          </div>

          <div className="product-actions">
            <button className="save-look-btn">SAVE LOOK</button>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>ADD TO CART</button>
          </div>

          <div className="product-description-tab">
            <div className="tab-header" onClick={handleTabToggle}>
              <h4>PRODUCT DETAILS</h4>
              <i
                className={`fa-solid fa-angle-down arrow-icon ${
                  tabState ? "rotate" : ""
                }`}
              />
            </div>
            <div className={`tab-content ${tabState ? "open" : ""}`}>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
      <SizeChartModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
      />
    </section>
  );
};

export default ProductDetail;
