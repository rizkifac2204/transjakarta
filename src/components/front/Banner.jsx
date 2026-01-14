import React from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

function Banner({ label, maplink }) {
  return (
    <section
      className="bg-cover position-relative"
      style={{ backgroundImage: `url('/front/main.jpg')` }}
      data-overlay="8"
    >
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-xl-7 col-lg-9 col-md-12 col-sm-12">
            <div className="position-relative text-center mb-5 pt-5 pt-lg-6">
              <h1 className="text-light xl-heading">{label}</h1>
              <nav id="breadcrumbs" className="breadcrumbs light">
                <ul className="flex items-center space-x-2">
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

export default Banner;
