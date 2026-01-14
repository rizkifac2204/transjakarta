import React from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

function BannerLeft({ label, maplink }) {
  return (
    <section className="bg-light">
      <div className="container">
        <div className="row justify-content-start align-items-center">
          <div className="col-xl-7 col-lg-9 col-md-12 col-sm-12 pt-lg-0 pt-5">
            <div className="position-relative">
              <h1 className="xl-heading">{label}</h1>
              <nav id="breadcrumbs" className="breadcrumbs">
                <ul>
                  {maplink.map((item, index) => (
                    <li key={index} className="flex items-center">
                      {index < maplink.length - 1 ? (
                        <>
                          <Link
                            href={item.href}
                            className="text-blue-600 hover:underline"
                          >
                            {item.label}
                          </Link>
                          <span className="mx-2">
                            <Icon icon="solar:alt-arrow-right-linear" />
                          </span>
                        </>
                      ) : (
                        <span>{item.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BannerLeft;
