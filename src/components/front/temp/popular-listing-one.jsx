"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Icons from "@/components/ui/Icon";

import { listData } from "./data";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function PopularListingOne() {
  return (
    <div className="row align-items-center justify-content-center">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <Swiper
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
          {listData.map((item, index) => {
            return (
              <SwiperSlide className="singleItem" key={index}>
                <div className="listingitem-container">
                  <div className="singlelisting-item">
                    <div className="listing-top-item">
                      <Link href="/single-listing-01" className="topLink">
                        <div className="position-absolute start-0 top-0 ms-3 mt-3 z-2">
                          <div className="d-flex align-items-center justify-content-start gap-2">
                            {item.status === "open" ? (
                              <span className="badge badge-xs text-uppercase listOpen">
                                Open
                              </span>
                            ) : (
                              <span className="badge badge-xs text-uppercase listClose">
                                Closed
                              </span>
                            )}

                            <span className="badge badge-xs badge-transparent">
                              $$$
                            </span>

                            {item.featured === true && (
                              <span className="badge badge-xs badge-transparent">
                                <Icons icon="material-symbols-light:star-outline" />
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                        <Image
                          src={item.image}
                          width={0}
                          height={0}
                          sizes="100vw"
                          style={{ width: "100%", height: "100%" }}
                          className="img-fluid"
                          alt="Listing Image"
                        />
                      </Link>
                      <div className="position-absolute end-0 bottom-0 me-3 mb-3 z-2">
                        <Link
                          href="/single-listing-01"
                          className="bookmarkList"
                          data-bs-toggle="tooltip"
                          data-bs-title="Save Listing"
                        >
                          <Icons
                            icon="mingcute:heart-line"
                            width="24"
                            height="24"
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="listing-middle-item">
                      <div className="listing-avatar">
                        <Link href="/single-listing-01" className="avatarImg">
                          <Image
                            src={item.user}
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
                            {item.title}
                            <span className="verified">
                              <Icons
                                icon="gravity-ui:seal-check"
                                width="16"
                                height="16"
                              />
                            </span>
                          </Link>
                        </h4>
                        <p>{item.desc}</p>
                      </div>
                      <div className="listing-info-details">
                        <div className="d-flex align-items-center justify-content-start gap-2">
                          <div className="list-calls">
                            <Icons icon="solar:phone-calling-broken" />
                            &nbsp;
                            {item.call}
                          </div>
                          <div className="list-distance">
                            <Icons icon="solar:map-linear" />
                            &nbsp;
                            {item.loction}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="listing-footer-item">
                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <div className="catdWraps">
                          <div className="flex-start">
                            <Link
                              href="/single-listing-01"
                              className="d-flex align-items-center justify-content-start gap-2"
                            >
                              <span className={`catIcon ${item.tagIconStyle}`}>
                                <Icons icon="ic:outline-info" />
                              </span>
                              <span className="catTitle">{item.tag}</span>
                            </Link>
                          </div>
                          <div className="flex-end">
                            <span className="moreCatcounter">+2</span>
                          </div>
                        </div>
                        <div className="listing-rates">
                          <div className="d-flex align-items-center justify-content-start gap-1">
                            <span className={`ratingAvarage ${item.rating}`}>
                              {item.ratingRate}
                            </span>
                            <span className="overallrates">{item.review}</span>
                          </div>
                        </div>
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
