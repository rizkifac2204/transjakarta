"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { PATH_UPLOAD } from "@/configs/appConfig";
import Icon from "@/components/ui/Icon";

function SliderItems({ data }) {
  const swiperRef = useRef(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted">No data available for slider</div>
    );
  }

  const repeatedData =
    data.length >= 8
      ? data
      : Array.from({ length: 8 }, (_, i) => data[i % data.length]);

  if (repeatedData?.length === 0) return <></>;

  return (
    <div className="row align-items-center justify-content-center">
      <div
        className="col-xl-12 col-lg-12 col-md-12 col-sm-12"
        onMouseEnter={() => swiperRef.current?.swiper?.autoplay?.stop()}
        onMouseLeave={() => swiperRef.current?.swiper?.autoplay?.start()}
      >
        <Swiper
          ref={swiperRef}
          slidesPerView={4}
          spaceBetween={15}
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
          {repeatedData.map((item, index) => {
            return (
              <SwiperSlide className="singleItem" key={index}>
                <div className="listingitem-container">
                  <div className="singlelisting-item">
                    <div className="listing-top-item">
                      <Link href={item?.link || "#"} className="topLink">
                        <div className="position-absolute start-0 top-0 ms-3 mt-3 z-2">
                          <div className="d-flex align-items-center justify-content-start gap-2">
                            {item?.link && (
                              <span className="badge badge-xs text-uppercase listOpen">
                                Open
                              </span>
                            )}
                          </div>
                        </div>
                        <Image
                          src={
                            item?.file
                              ? `/api/services/file/uploads/${PATH_UPLOAD.slider}/${item?.file}`
                              : `/assets/images/logo-color.png`
                          }
                          width={0}
                          height={0}
                          sizes="100vw"
                          style={{ width: "100%", height: "100%" }}
                          className="img-fluid"
                          alt={item?.file || `/assets/images/logo-color.png`}
                        />
                      </Link>
                    </div>
                    <div className="listing-middle-item">
                      <div className="listing-avatar">
                        <Link href={item?.link || "#"} className="avatarImg">
                          <Image
                            src={`/assets/images/logo-color.png`}
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: "100%", height: "100%" }}
                            className="img-fluid circle"
                            alt="Avatar"
                          />
                        </Link>
                      </div>
                      <div className="listing-details">
                        <h4 className="listingTitle">
                          <Link href="/single-listing-01" className="titleLink">
                            <strong>{item?.judul}</strong>
                            <span className="verified">
                              <Icon
                                icon="solar:cloud-check-broken"
                                width="16"
                                height="16"
                              />
                            </span>
                          </Link>
                        </h4>
                        <p>
                          {item?.deskripsi.length > 100
                            ? item.deskripsi.slice(0, 100) + "..."
                            : item.deskripsi}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default SliderItems;
