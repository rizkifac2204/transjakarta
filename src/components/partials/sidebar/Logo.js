import React from "react";
import Link from "next/link";
import Image from "next/image";
import useDarkMode from "@/themes/dashcode/hooks/useDarkMode";
import useSidebar from "@/themes/dashcode/hooks/useSidebar";
import useSemiDark from "@/themes/dashcode/hooks/useSemiDark";
import useSkin from "@/themes/dashcode/hooks/useSkin";
import appConfig from "@/configs/appConfig";

const SidebarLogo = ({ menuHover }) => {
  const [isDark] = useDarkMode();
  const [collapsed, setMenuCollapsed] = useSidebar();
  // semi dark
  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();
  return (
    <div
      className={` logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-[9] py-6  px-4 
      ${menuHover ? "logo-hovered" : ""}
      ${
        skin === "bordered"
          ? " border-b border-r-0 border-slate-200 dark:border-slate-700"
          : " border-none"
      }
      `}
    >
      <Link href="/admin">
        <div className="flex items-center space-x-2">
          <div className="relative w-8 h-8">
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
                src="/assets/images/logo-color.png"
                alt=""
                priority
                fill
                sizes="33vw"
                style={{ objectFit: "contain" }}
              />
            )}
          </div>

          {(!collapsed || menuHover) && (
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-[#c8a25e] via-[#d4b06a] to-[#e1be76] bg-clip-text text-transparent">
                {appConfig.app.name}
              </h1>
            </div>
          )}
        </div>
      </Link>

      {(!collapsed || menuHover) && (
        <div
          onClick={() => setMenuCollapsed(!collapsed)}
          className={`cursor-pointer h-4 w-4 border-[1.5px] border-slate-900 dark:border-slate-700 rounded-full transition-all duration-150
          ${
            collapsed
              ? ""
              : "ring-2 ring-inset ring-offset-4 ring-black-900 dark:ring-slate-400 bg-orange-900 dark:bg-orange-400 dark:ring-offset-slate-700"
          }
          `}
        ></div>
      )}
    </div>
  );
};

export default SidebarLogo;
