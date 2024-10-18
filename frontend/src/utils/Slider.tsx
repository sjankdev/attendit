import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner1 from "../assets/photos/banners/banner1.jpg";
import banner2 from "../assets/photos/banners/banner2.jpg";
import "../assets/css/Slider.css";

const BannerSlider: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div className="slide">
          <img src={banner1} alt="Banner 1" className="slider-image" />
          <div className="text-overlay">
            <h1>Event Management</h1>
            <p>Plan your events with ease.</p>
          </div>
        </div>
        <div className="slide">
          <img src={banner2} alt="Banner 2" className="slider-image" />
          <div className="text-overlay">
            <h1>Plan Your Next Event</h1>
            <p>Make unforgettable memories!</p>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default BannerSlider;
