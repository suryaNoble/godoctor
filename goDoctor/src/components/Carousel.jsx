// import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80"
// src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80"
// src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80"
 

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { assets } from '../assets/assets_frontend/assets';

const Carousel = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]} 
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000, 
        disableOnInteraction: false, 
        pauseOnMouseEnter: true,
      }}
      className="w-full h-[500px] rounded-lg  relative"
    >
            <SwiperSlide>
        <div className="relative w-full h-full">
          <img
            className="w-full h-full object-cover"
            src={assets.carous1}
            alt="Slide 3"
          />
          <a href="#specials">
          <button
            className="absolute bottom-14 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Book Now!
          </button>
          </a>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="relative w-full h-full">
          <img
            className="w-full h-full object-cover"
            src={assets.carous2}
            alt="Slide 3"
          />

          <a href="#specials">
          <button
            className="absolute bottom-14 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Book Now!
          </button>
          </a>
        </div>
      </SwiperSlide>
    <SwiperSlide>
    <div className="relative w-full h-full">
    
    <img
      className="w-full h-full object-cover"
      src={assets.carous3}
      alt="Slide 3"
    />

          <a href="#specials">
          <button
            className="absolute bottom-14 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Book Now!
          </button>
          </a>
    </div>
</SwiperSlide>

    </Swiper>
  );
};

export default Carousel;
