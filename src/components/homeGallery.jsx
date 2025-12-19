import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const HomeGallery = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const allImages = [
    "/Images/suit1.png",
    "/Images/suit2.png",
    "/Images/suit3.png",
    "/Images/suit4.png",
    "/Images/suit2.png",
    "/Images/suit4.png",
    "/Images/suit1.png",
    "/Images/suit3.png",
    "/Images/suit4.png",
  ];

  const [visible, setVisible] = useState(6);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(null);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalOpen]);

  const loadMore = () => {
    setVisible((prev) => prev + 3);
  };

  const openModal = (img) => {
    setActiveImg(img);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveImg(null);
  };

  return (
    <>
    <section className="gallery-wrapper" data-aos="fade-up">
      <h2>
        SEE HOW OTHERS SYNCED <br /> THEIR LOOK
      </h2>

      <div className="container">
        <div className="synced-gallery">
          {allImages.slice(0, visible).map((img, index) => (
            <div
              className="synced-img-box"
              key={index}
              onClick={() => openModal(img)}
            >
              <img src={img} alt={`Look ${index}`} />
              <div className="img-overlay">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>
          ))}
        </div>

        {visible < allImages.length && (
          <button className="designBtn" onClick={loadMore}>
            Load More
          </button>
        )}
      </div>

      
    </section>
    {modalOpen && (
        <div className="gallery-modal">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="suit-image">
              <img src={activeImg} alt="Preview" className="modal-image" />
            </div>
          </div>
        </div>
      )}
      </>
  );
};

export default HomeGallery;