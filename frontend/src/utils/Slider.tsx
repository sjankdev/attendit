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
    <div className="banner-slider">
      <Slider {...settings}>
        <div className="banner-slide">
          <img src={banner1} alt="Banner 1" className="banner-image" />
          <div className="banner-content">
            <h1 className="banner-title">Event Management</h1>
            <p className="banner-description">Plan your events with ease.</p>
          </div>
        </div>

        <div className="banner-slide">
          <img src={banner2} alt="Banner 2" className="banner-image" />
          <div className="banner-content">
            <h1 className="banner-title">Plan Your Next Event</h1>
            <p className="banner-description">Make unforgettable memories!</p>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default BannerSlider;
