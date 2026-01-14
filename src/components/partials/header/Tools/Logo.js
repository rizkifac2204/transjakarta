"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import useDarkMode from "@/themes/dashcode/hooks/useDarkMode";
import useWidth from "@/themes/dashcode/hooks/useWidth";

const Logo = () => {
  const [isDark] = useDarkMode();
  const { width, breakpoints } = useWidth();

  return (
    <div>
      <Link href="/admin">
        <React.Fragment>
          {width >= breakpoints.xl ? (
            <Image
              src={
                isDark
                  ? "/assets/images/logo-white.png"
                  : "/assets/images/logo-color.png"
              }
              alt=""
              width={40}
              height={40}
              style={{ width: "auto" }}
            />
          ) : (
            <Image
              src={
                isDark
                  ? "/assets/images/logo-white.png"
                  : "/assets/images/logo-color.png"
              }
              alt=""
              width={30}
              height={30}
              style={{ width: "auto" }}
            />
          )}
        </React.Fragment>
      </Link>
    </div>
  );
};

export default Logo;
