"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";

// hooks
import useWidth from "@/themes/dashcode/hooks/useWidth";
import useSidebar from "@/themes/dashcode/hooks/useSidebar";
import useContentWidth from "@/themes/dashcode/hooks/useContentWidth";
import useMenulayout from "@/themes/dashcode/hooks/useMenulayout";
import useMenuHidden from "@/themes/dashcode/hooks/useMenuHidden";
import useMobileMenu from "@/themes/dashcode/hooks/useMobileMenu";
import useRtl from "@/themes/dashcode/hooks/useRtl";
import useDarkMode from "@/themes/dashcode/hooks/useDarkMode";
import useSkin from "@/themes/dashcode/hooks/useSkin";
import useNavbarType from "@/themes/dashcode/hooks/useNavbarType";

import Header from "@/components/partials/header";
import Sidebar from "@/components/partials/sidebar";
import Settings from "@/components/partials/settings";
import MobileMenu from "@/components/partials/sidebar/MobileMenu";
import Footer from "@/components/partials/footer";
import MobileFooter from "@/components/partials/footer/MobileFooter";
import Loading from "@/components/Loading";

export default function Layout({ children }) {
  const { width, breakpoints } = useWidth();
  const [collapsed] = useSidebar();
  const [isRtl] = useRtl();
  const [isDark] = useDarkMode();
  const [skin] = useSkin();
  const [navbarType] = useNavbarType();
  // content width
  const [contentWidth] = useContentWidth();
  const [menuType] = useMenulayout();
  const [menuHidden] = useMenuHidden();

  //   header switch class
  const switchHeaderClass = () => {
    if (menuType === "horizontal" || menuHidden) {
      return "ltr:ml-0 rtl:mr-0";
    } else if (collapsed) {
      return "ltr:ml-[72px] rtl:mr-[72px]";
    } else {
      return "ltr:ml-[248px] rtl:mr-[248px]";
    }
  };

  // mobile menu
  const [mobileMenu, setMobileMenu] = useMobileMenu();

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`app-warp ${isDark ? "dark" : ""} ${
        skin === "bordered" ? "skin--bordered" : "skin--default"
      } ${navbarType === "floating" ? "has-floating" : ""}
      `}
    >
      <ToastContainer
        position={isRtl ? "top-left" : "top-right"}
        autoClose={5000}
        closeOnClick
        rtl={isRtl ? true : false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
      />
      <Header className={width > breakpoints.xl ? switchHeaderClass() : ""} />
      {menuType === "vertical" && width > breakpoints.xl && !menuHidden && (
        <Sidebar />
      )}
      <MobileMenu
        className={`${
          width < breakpoints.xl && mobileMenu
            ? "left-0 visible opacity-100 z-[9999]"
            : "left-[-300px] invisible opacity-0 z-[-999] "
        }`}
      />
      {/* mobile menu overlay*/}
      {width < breakpoints.xl && mobileMenu && (
        <div
          className="overlay bg-slate-900/50 backdrop-filter backdrop-blur-sm opacity-100 fixed inset-0 z-[999]"
          onClick={() => setMobileMenu(false)}
        ></div>
      )}
      <Settings />
      <div
        className={`content-wrapper transition-all duration-150 ${
          width > 1280 ? switchHeaderClass() : ""
        }`}
      >
        {/* md:min-h-screen will h-full */}
        <div className="page-content page-min-height  ">
          <div
            className={
              contentWidth === "boxed" ? "container mx-auto" : "container-fluid"
            }
          >
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </div>
      </div>
      {width < breakpoints.md && <MobileFooter />}
      {width > breakpoints.md && (
        <Footer className={width > breakpoints.xl ? switchHeaderClass() : ""} />
      )}
    </div>
  );
}
