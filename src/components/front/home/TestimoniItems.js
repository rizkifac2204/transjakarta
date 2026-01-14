"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { PATH_UPLOAD } from "@/configs/appConfig";

function hitungBintang(rating) {
  if (typeof rating !== "number" || isNaN(rating)) {
    return <span className="text-sm">Rating tidak valid</span>;
  }

  const maxStars = 5;
  const avg = Math.min(Math.max(rating, 0), maxStars); // pastikan antara 0-5
  const filledStars = Math.floor(avg);
  const halfStar = avg - filledStars >= 0.5;
  const emptyStars = maxStars - filledStars - (halfStar ? 1 : 0);

  return (
    <div className="d-flex align-items-center text-warning gap-1">
      {Array(filledStars)
        .fill()
        .map((_, i) => (
          <span key={`full-${i}`}>&#9733;</span> // ★
        ))}
      {halfStar && <span key="half">&#189;</span>} {/* ½ */}
      {Array(emptyStars)
        .fill()
        .map((_, i) => (
          <span key={`empty-${i}`}>&#9734;</span> // ☆
        ))}
    </div>
  );
}

function TestimoniItems({ data }) {
  const swiperRef = useRef(null);
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted">
        No data available for testimoni
      </div>
    );
  }

  const repeatedData =
    data.length >= 8
      ? data
      : Array.from({ length: 8 }, (_, i) => data[i % data.length]);

  if (repeatedData?.length === 0)
    return (
      <h5 className="text-center text-muted">
        <i>Belum Tersedia</i>
      </h5>
    );

  return (
    <div className="row align-items-center justify-content-center">
      <div
        onMouseEnter={() => swiperRef.current?.swiper?.autoplay?.stop()}
        onMouseLeave={() => swiperRef.current?.swiper?.autoplay?.start()}
      >
        <Swiper
          ref={swiperRef}
          slidesPerView={4}
          spaceBetween={30}
          modules={[Autoplay, Pagination]}
          pagination={true}
          loop={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1440: { slidesPerView: 4 },
          }}
        >
          {repeatedData?.map((item, index) => (
            <SwiperSlide className="singleItem" key={index}>
              <div className="reviews-wrappers">
                <div className="reviewsBox card border-0 rounded-4 shadow-sm">
                  <div className="card-body p-xl-5 p-lg-5 p-4">
                    <div className="reviews-topHeader d-flex flex-column mb-3">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {hitungBintang(item?.rating)}
                      </div>
                      <div className="revws-desc text-center">
                        <p className="m-0 text-dark">
                          {`‟`}
                          {item?.komentar?.length > 100
                            ? item.komentar.slice(0, 100) + "..."
                            : item.komentar}
                          {`‟`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="reviewsers d-flex flex-column mt-5">
                  <div className="d-flex align-items-center flex-column flex-thumbes gap-2">
                    <div className="revws-pic">
                      <Image
                        src={
                          item?.pemohon?.foto
                            ? `/api/${PATH_UPLOAD.pemohon}/${item?.pemohon?.foto}`
                            : `/assets/images/user.png`
                        }
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "55px", height: "auto" }}
                        className="img-fluid circle"
                        alt={item?.pemohon?.nama}
                      />
                    </div>
                    <div className="revws-caps text-center">
                      <h6 className="fw-medium fs-6 m-0">
                        {item?.pemohon?.nama}
                      </h6>
                      <p className="text-muted-2 text-md m-0">
                        {item?.pemohon?.pekerjaan}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default TestimoniItems;
