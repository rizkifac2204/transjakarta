import React from "react";
import Link from "next/link";

import { blogData } from "./data";
import Image from "next/image";
import Icon from "@/components/ui/Icon";

export default function BlogOne() {
  return (
    <div className="row align-items-center justify-content-center g-4">
      {blogData.slice(0, 3).map((item, index) => {
        return (
          <div className="col-xl-4 col-lg-4 col-md-6" key={index}>
            <div className="card rounded-4 shadow-sm h-100">
              <Link
                href={`/blog-detail/${item.id}`}
                className="d-block bg-gradient rounded-top"
              >
                <Image
                  className="card-img-top hover-fade-out"
                  src={item.image}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "100%" }}
                  alt="blog image"
                />
              </Link>
              <div className="card-body">
                <Link href={`/blog-detail/${item.id}`}>
                  <h4 className="fw-medium fs-5 lh-base mb-3">{item.title}</h4>
                </Link>
                <p>{item.desc}</p>
                <div className="d-flex align-items-center justify-content-start mt-4">
                  <Link
                    href={`/blog-detail/${item.id}`}
                    className="badge badge-primary rounded-pill"
                  >
                    Continue Reading
                  </Link>
                </div>
              </div>
              <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
                <Link
                  href={`/blog-detail/${item.id}`}
                  className="text-dark fw-medium text-md d-flex align-items-center"
                >
                  <Icon icon="solar:calendar-add-broken" />
                  &nbsp; {item.date}
                </Link>
                <div className="text-muted text-md d-flex align-items-center">
                  <Icon icon="solar:eye-broken" />
                  &nbsp; {item.views}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
