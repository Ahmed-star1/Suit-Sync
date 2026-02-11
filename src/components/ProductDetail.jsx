import React, { useState, useEffect, useRef } from "react";
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
    product?.images?.[0] || "/Images/suit1.png",
  );

  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");

  const [selectedPantSize, setSelectedPantSize] = useState("");
  const [selectedPantInnerSize, setSelectedPantInnerSize] = useState("");

  const [selectedCoatSize, setSelectedCoatSize] = useState("");
  const [selectedCoatInnerSize, setSelectedCoatInnerSize] = useState("");

  const [selectedPriceType, setSelectedPriceType] = useState("");
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);

  const [selectedShirtSize, setSelectedShirtSize] = useState("");

  const [selectedTie, setSelectedTie] = useState(false);
  const [selectedTieSize, setSelectedTieSize] = useState("");

  const [selectedBow, setSelectedBow] = useState(false);
  const [selectedBowSize, setSelectedBowSize] = useState("");

  const [selectedShoes, setSelectedShoes] = useState(false);
  const [selectedShoesSize, setSelectedShoesSize] = useState("");

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const [isAlertShowing, setIsAlertShowing] = useState(false);
  
  const alertTimeoutRef = useRef(null);

  const handleTabToggle = () => {
    setTabState(!tabState);
  };

  const showCustomAlert = (message) => {
    setIsAlertShowing(true);
    alert(message);
    
    clearTimeout(alertTimeoutRef.current);
    alertTimeoutRef.current = setTimeout(() => {
      setIsAlertShowing(false);
    }, 100);
  };

  const handleAddToCart = () => {
    if (
      !selectedPantSize ||
      !selectedPantInnerSize ||
      !selectedCoatSize ||
      !selectedCoatInnerSize ||
      !selectedColor ||
      !selectedPriceType
    ) {
      showCustomAlert("Please select all required options");
      return;
    }

    if (selectedPriceType === "buy") {
      navigate("/cart");
    }

    if (selectedPriceType === "rent") {
      setIsRentModalOpen(true);
      setShowRentModal(true);
      document.body.style.overflow = "hidden";
    }
  };

  const closeRentModal = () => {
    setShowRentModal(false);
    setAgreeToTerms(false);
    setIsAlertShowing(false); 

    setTimeout(() => {
      setIsRentModalOpen(false);
      document.body.style.overflow = "auto";
      setSizeDropdownOpen(false);
    }, 300);
  };

  const handleConfirmRent = () => {
    if (isAlertShowing) return;

    if (!selectedShirtSize) {
      showCustomAlert("Please select shirt size");
      return;
    }

    if (selectedTie && !selectedTieSize) {
      showCustomAlert("Please select tie size");
      return;
    }

    if (selectedBow && !selectedBowSize) {
      showCustomAlert("Please select bow size");
      return;
    }

    if (selectedShoes && !selectedShoesSize) {
      showCustomAlert("Please select shoes size");
      return;
    }

    if (!agreeToTerms) {
      showCustomAlert("Please agree to the rental terms and conditions");
      return;
    }

    setShowRentModal(false);
    setAgreeToTerms(false);
    setIsAlertShowing(false); 

    setTimeout(() => {
      setIsRentModalOpen(false);
      document.body.style.overflow = "auto";
      setSizeDropdownOpen(false);
      navigate("/cart");
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".custom-select-wrapper")) {
        setSizeDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      clearTimeout(alertTimeoutRef.current); 
    };
  }, []);

  const isConfirmDisabled = !agreeToTerms || isAlertShowing;

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
              <h5>COAT SIZE</h5>
              <div className="sizes-dropdown">
                <div className="custom-select-wrapper">
                  <div
                    className="custom-select"
                    onClick={() => setSizeDropdownOpen("coat")}
                  >
                    <span className="selected-value">
                      {selectedCoatSize || "Select Coat Size"}
                    </span>
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>

                  {sizeDropdownOpen === "coat" && (
                    <ul className="custom-select-dropdown">
                      {product.coatSizes.map((coat, index) => (
                        <li
                          key={index}
                          className={
                            selectedCoatSize === coat.label ? "active" : ""
                          }
                          onClick={() => {
                            setSelectedCoatSize(coat.label);
                            setSelectedCoatInnerSize("");
                            setSizeDropdownOpen(false);
                          }}
                        >
                          {coat.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {selectedCoatSize && (
                  <div className="custom-select-wrapper">
                    <div
                      className="custom-select"
                      onClick={() => setSizeDropdownOpen("coatInner")}
                    >
                      <span className="selected-value">
                        {selectedCoatInnerSize || "Select Length"}
                      </span>
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>

                    {sizeDropdownOpen === "coatInner" && (
                      <ul className="custom-select-dropdown">
                        {product.coatSizes
                          .find((c) => c.label === selectedCoatSize)
                          ?.values.map((size, index) => (
                            <li
                              key={index}
                              className={
                                selectedCoatInnerSize === size ? "active" : ""
                              }
                              onClick={() => {
                                setSelectedCoatInnerSize(size);
                                setSizeDropdownOpen(false);
                              }}
                            >
                              {size}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="sizes">
              <h5>PANT SIZE</h5>
              <div className="sizes-dropdown">
                <div className="custom-select-wrapper">
                  <div
                    className="custom-select"
                    onClick={() => setSizeDropdownOpen("pant")}
                  >
                    <span className="selected-value">
                      {selectedPantSize || "Select Pant Size"}
                    </span>
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>

                  {sizeDropdownOpen === "pant" && (
                    <ul className="custom-select-dropdown">
                      {product.pantSizes.map((pant, index) => (
                        <li
                          key={index}
                          className={
                            selectedPantSize === pant.label ? "active" : ""
                          }
                          onClick={() => {
                            setSelectedPantSize(pant.label);
                            setSelectedPantInnerSize("");
                            setSizeDropdownOpen(false);
                          }}
                        >
                          {pant.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {selectedPantSize && (
                  <div className="custom-select-wrapper">
                    <div
                      className="custom-select"
                      onClick={() => setSizeDropdownOpen("pantInner")}
                    >
                      <span className="selected-value">
                        {selectedPantInnerSize || "Select Length"}
                      </span>
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>

                    {sizeDropdownOpen === "pantInner" && (
                      <ul className="custom-select-dropdown">
                        {product.pantSizes
                          .find((p) => p.label === selectedPantSize)
                          ?.values.map((size, index) => (
                            <li
                              key={index}
                              className={
                                selectedPantInnerSize === size ? "active" : ""
                              }
                              onClick={() => {
                                setSelectedPantInnerSize(size);
                                setSizeDropdownOpen(false);
                              }}
                            >
                              {size}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
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
              <div
                className={`price-option ${
                  selectedPriceType === "buy" ? "active" : ""
                }`}
                onClick={() => setSelectedPriceType("buy")}
              >
                <span className="price-label">BUY:</span>
                <span className="price-value">{product.buyPrice}</span>
              </div>

              <div
                className={`price-option ${
                  selectedPriceType === "rent" ? "active" : ""
                }`}
                onClick={() => setSelectedPriceType("rent")}
              >
                <span className="price-label">RENT:</span>
                <span className="price-value">{product.rentPrice}</span>
              </div>
            </div>
          </div>

          <div className="product-actions">
            <button className="save-look-btn">SAVE LOOK</button>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              ADD TO CART
            </button>
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

      {isRentModalOpen && (
        <div
          className={`rent-modal-overlay ${
            showRentModal ? "fade-in" : "fade-out"
          }`}
        >
          <div
            className={`rent-modal ${showRentModal ? "modal-in" : "modal-out"}`}
          >
            <h3>SHIRT (Included at no extra cost)</h3>

            <div className="custom-select-wrapper">
              <div
                className="custom-select"
                onClick={() => setSizeDropdownOpen("shirt")}
              >
                <span className="selected-value">
                  {selectedShirtSize || "Select Shirt Size"}
                </span>
                <i className="fa-solid fa-chevron-down"></i>
              </div>

              {sizeDropdownOpen === "shirt" && (
                <ul className="custom-select-dropdown">
                  {product.shirtSizes.map((size, index) => (
                    <li
                      key={index}
                      className={selectedShirtSize === size ? "active" : ""}
                      onClick={() => {
                        setSelectedShirtSize(size);
                        setSizeDropdownOpen(false);
                      }}
                    >
                      {size}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <h3 className="addon-heading">ADD-ONS</h3>
            <div className="all-adons">
              <div className="addon">
                <div
                  className={`price-option ${selectedTie ? "active" : ""}`}
                  onClick={() => {
                    setSelectedTie(!selectedTie);
                    if (selectedTie) setSelectedTieSize("");
                  }}
                >
                  <span className="price-label">
                    {product.addons.tie.label}
                  </span>
                </div>
                {selectedTie && (
                  <div className="custom-select-wrapper">
                    <div
                      className="custom-select"
                      onClick={() => setSizeDropdownOpen("tie")}
                    >
                      <span className="selected-value">
                        {selectedTieSize || "Select Tie Size"}
                      </span>
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>

                    {sizeDropdownOpen === "tie" && (
                      <ul className="custom-select-dropdown">
                        {product.addons.tie.sizes.map((size, index) => (
                          <li
                            key={index}
                            className={selectedTieSize === size ? "active" : ""}
                            onClick={() => {
                              setSelectedTieSize(size);
                              setSizeDropdownOpen(false);
                            }}
                          >
                            {size}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <div className="addon">
                <div
                  className={`price-option ${selectedBow ? "active" : ""}`}
                  onClick={() => {
                    setSelectedBow(!selectedBow);
                    if (selectedBow) setSelectedBowSize("");
                  }}
                >
                  <span className="price-label">
                    {product.addons.bow.label}
                  </span>
                </div>
                {selectedBow && (
                  <div className="custom-select-wrapper">
                    <div
                      className="custom-select"
                      onClick={() => setSizeDropdownOpen("bow")}
                    >
                      <span className="selected-value">
                        {selectedBowSize || "Select Bow Size"}
                      </span>
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>

                    {sizeDropdownOpen === "bow" && (
                      <ul className="custom-select-dropdown">
                        {product.addons.bow.sizes.map((size, index) => (
                          <li
                            key={index}
                            className={selectedBowSize === size ? "active" : ""}
                            onClick={() => {
                              setSelectedBowSize(size);
                              setSizeDropdownOpen(false);
                            }}
                          >
                            {size}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <div className="addon">
                <div
                  className={`price-option ${selectedShoes ? "active" : ""}`}
                  onClick={() => {
                    setSelectedShoes(!selectedShoes);
                    if (selectedShoes) setSelectedShoesSize("");
                  }}
                >
                  <span className="price-label">
                    {product.addons.shoes.label}
                  </span>
                </div>
                {selectedShoes && (
                  <div className="custom-select-wrapper">
                    <div
                      className="custom-select"
                      onClick={() => setSizeDropdownOpen("shoes")}
                    >
                      <span className="selected-value">
                        {selectedShoesSize || "Select Shoes Size"}
                      </span>
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>

                    {sizeDropdownOpen === "shoes" && (
                      <ul className="custom-select-dropdown">
                        {product.addons.shoes.sizes.map((size, index) => (
                          <li
                            key={index}
                            className={
                              selectedShoesSize === size ? "active" : ""
                            }
                            onClick={() => {
                              setSelectedShoesSize(size);
                              setSizeDropdownOpen(false);
                            }}
                          >
                            {size}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="agreement-checkbox">
              <input
                type="checkbox"
                id="rentalAgreement"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <label htmlFor="rentalAgreement">
                I agree to the terms, and I understand I need to return my suit
                within X days.
              </label>
            </div>

            <div className="button-row">
              <button
                className={`designBtn2 ${isConfirmDisabled ? "disabled" : ""}`}
                onClick={handleConfirmRent}
                disabled={isConfirmDisabled}
              >
                Confirm
              </button>
              <button className="designBtn2" onClick={closeRentModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetail;