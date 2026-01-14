"use client";

import React from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import CountUp from "react-countup";

function HeadCount({ data }) {
  return (
    <div className="row align-items-start g-4 mb-lg-5 mb-4">
      {data.map((item, index) => {
        return (
          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6" key={index}>
            <Link href={item.link}>
              <div className="card rounded-3 position-relative p-4">
                <div
                  className={`position-absolute w-30 h-100 start-0 top-0 rounded-end-pill ${item.bg}`}
                >
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <Icon
                      icon={item.icon}
                      className={`fs-2 ${item.iconStyle}`}
                    />
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end ht-80">
                  <h2 className="mb-0">
                    <CountUp className="ctr" end={item.count} />
                  </h2>
                  <p className="text-muted-2 fw-medium mb-0">{item.title}</p>
                  {item.jawaban ? (
                    <p className="text-xs">{item.jawaban} Jawaban</p>
                  ) : null}
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default HeadCount;
