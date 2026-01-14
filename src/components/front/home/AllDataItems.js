"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

function AllDataItems({ data }) {
  const swiperRef = useRef(null);
  return (
    <div className="row align-items-center justify-content-center">
      <div
        onMouseEnter={() => swiperRef.current?.swiper?.autoplay?.stop()}
        onMouseLeave={() => swiperRef.current?.swiper?.autoplay?.start()}
      >
        <Swiper
          ref={swiperRef}
          slidesPerView={6}
          spaceBetween={30}
          modules={[Autoplay]}
          loop={true}
          autoplay={{ delay: 2100, disableOnInteraction: false }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
        >
          {data.map((item, index) => (
            <SwiperSlide className="singleCategory" key={index}>
              <div className="category-small-wrapper light">
                <Link href={item.link} className="categoryBox">
                  <div className="categoryCapstions">
                    <div className="catsIcons">
                      <div className="icoBoxx">
                        <Icon icon={item.icon} />
                      </div>
                    </div>
                    <div className="catsTitle">
                      <h5>{item.label}</h5>
                    </div>
                    <div className="CatsLists">
                      <span className="categorycounter">Lihat</span>
                    </div>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default AllDataItems;
