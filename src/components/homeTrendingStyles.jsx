import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";


const TrendingStyles = () => {
  const demoStyles = [
    {
      title: "Black Tuxedo Suit",
      image: "/Images/suit1.png",
    },
    {
      title: "Blue Tuxedo Suit",
      image: "/Images/suit2.png",
    },
    {
      title: "Black Tuxedo Suit",
      image: "/Images/suit3.png",
    },
    {
      title: "Blue Tuxedo Suit",
      image: "/Images/suit4.png",
    },
    {
      title: "Blue Tuxedo Suit",
      image: "/Images/suit1.png",
    },
  ];

  return (
    <section className="trending-wrapper">
      <h2>TRENDING STYLES</h2>
      <div class="container">
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
        {demoStyles.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="trending-card">
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
    </section>
  );
};

export default TrendingStyles;