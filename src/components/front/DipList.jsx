"use client";

import React from "react";
import Link from "next/link";
import Icon from "../ui/Icon";

export default function DipList({ blocks, noCount }) {
  return (
    <div className="row">
      {blocks.map((item, index) => (
        <div className="col-12 col-sm-6 col-lg-3 mb-4" key={index}>
          <div className="category-small-wrapper light h-100">
            <Link href={item?.link} className="categoryBox d-block h-100">
              <div className="categoryCapstions d-flex flex-column h-100 justify-content-between">
                <div className="catsIcons">
                  <div className="icoBoxx">
                    <Icon icon={item.icon} />
                  </div>
                </div>
                <div className="catsTitle">
                  <h5>{item?.label}</h5>
                </div>
                {noCount ? null : (
                  <div className="CatsLists">
                    <span className="categorycounter">
                      {item?.newtab ? "To Link" : `${item.count} List`}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
