import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SimpleBar from "simplebar-react";

import useSemiDark from "@/themes/dashcode/hooks/useSemiDark";
import useSkin from "@/themes/dashcode/hooks/useSkin";
import useDarkMode from "@/themes/dashcode/hooks/useDarkMode";
import useMobileMenu from "@/themes/dashcode/hooks/useMobileMenu";

import Icon from "@/components/ui/Icon";
import Navmenu from "@/components/partials/sidebar/Navmenu";
import appConfig from "@/configs/appConfig";

const MobileMenu = ({ className = "custom-class" }) => {
  const scrollableNodeRef = useRef();
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (scrollableNodeRef.current.scrollTop > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    scrollableNodeRef.current.addEventListener("scroll", handleScroll);
  }, [scrollableNodeRef]);

  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();
  const [isDark] = useDarkMode();
  const [mobileMenu, setMobileMenu] = useMobileMenu();
  return (
    <div className={isSemiDark ? "dark" : ""}>
      <div
        className={`${className} fixed  top-0 bg-white dark:bg-slate-800 shadow-lg  h-full   w-[248px]`}
      >
        <div className="logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-[9] h-[85px]  px-4 ">
          <Link href="/admin">
            <div className="flex items-center space-x-4">
              <div className="logo-icon relative w-14 h-8">
                {!isDark && !isSemiDark ? (
                  <Image
                    src="/assets/images/logo-color.png"
                    alt=""
                    priority
                    fill
                    sizes="33vw"
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <Image
                    src="/assets/images/logo-white.png"
                    alt=""
                    priority
                    fill
                    sizes="33vw"
                    style={{ objectFit: "contain" }}
                  />
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {appConfig.app.name}
                </h1>
              </div>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="cursor-pointer text-slate-900 dark:text-white text-2xl"
          >
            <Icon icon="heroicons:x-mark" />
          </button>
        </div>

        <div
          className={`h-[60px] absolute top-[80px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none ${
            scroll ? " opacity-100" : " opacity-0"
          }`}
        ></div>
        <SimpleBar
          className="sidebar-menu px-4 h-[calc(100%-80px)]"
          scrollableNodeProps={{ ref: scrollableNodeRef }}
        >
          <Navmenu />
        </SimpleBar>
      </div>
    </div>
  );
};

export default MobileMenu;
