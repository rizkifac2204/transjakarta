"use client";

import BannerLeft from "@/components/front/BannerLeft";
import { usePathname } from "next/navigation";

export default function Template({ children }) {
  const pathname = usePathname();
  const parts = pathname.split("/");

  const maplink = parts.map((part, index) => {
    const href = "/" + parts.slice(1, index + 1).join("/");
    const label =
      part === ""
        ? "Home"
        : part
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    return {
      label,
      href: href === "" ? "/" : href, // untuk root
    };
  });

  return (
    <>
      <BannerLeft label="Daftar Informasi Publik" maplink={maplink} />

      {children}
    </>
  );
}
