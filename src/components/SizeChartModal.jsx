import React, { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const sizeChartImages = [
  "/Images/size-guide1.jpg",
  "/Images/size-guide2.jpg",
  "/Images/size-guide3.jpg",
];

const SizeChartModal = ({ isOpen, onClose }) => {
  const [closing, setClosing] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (isOpen && !closing) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, closing]);

  const handleClose = () => {
    setClosing(true);

    setTimeout(() => {
      document.body.style.overflow = "auto";
      setClosing(false);
      setZoom(1);
      onClose();
    }, 300); 
  };

  const zoomIn = () => {
    setZoom((currentZoom) => Math.min(currentZoom + 0.25, 2.5));
  };

  const zoomOut = () => {
    setZoom((currentZoom) => Math.max(currentZoom - 0.25, 1));
  };

  if (!isOpen && !closing) return null;

  return (
    <div className={`size-modal-overlay ${closing ? "fade-out" : "fade-in"}`}>
      <div className={`size-modal-container ${closing ? "scale-out" : "scale-in"}`}>
        <button className="modal-close-btn" onClick={handleClose}>
          X
        </button>

        <div className="modal-right size-slider-content">
          <div className="size-modal-header">
            <h2 className="modal-title">Size Chart</h2>
            <div className="size-zoom-controls">
              <button type="button" onClick={zoomOut} disabled={zoom === 1}>
                -
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={zoomIn} disabled={zoom === 2.5}>
                +
              </button>
            </div>
          </div>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
            onSlideChange={() => setZoom(1)}
            className="size-chart-swiper"
          >
            {sizeChartImages.map((image, index) => (
              <SwiperSlide key={image}>
                <div className="size-chart-image-frame">
                  <img
                    src={image}
                    alt={`Size chart ${index + 1}`}
                    style={{ width: `${zoom * 100}%` }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default SizeChartModal;
