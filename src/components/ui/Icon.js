"use client";

import React from "react";
import { Icon } from "@iconify/react";
export default function Icons({
  icon,
  className,
  width,
  rotate,
  hFlip,
  vFlip,
}) {
  return (
    <>
      <Icon
        width={width}
        rotate={rotate}
        hFlip={hFlip}
        icon={icon}
        className={className}
        vFlip={vFlip}
      />
    </>
  );
}
