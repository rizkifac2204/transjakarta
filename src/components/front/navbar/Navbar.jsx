"use client";

import React, { useState, useEffect, Fragment } from "react";
import { usePathname } from "next/navigation";
import { useNotFound } from "@/providers/not-found-context";
import { useAuthContext } from "@/providers/auth-provider";
import { useAuthPublic } from "@/providers/auth-public-provider";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import Image from "next/image";
import NavbarDashboard from "./NavbarDashboard";
import NavbarDashboardMobile from "./NavbarDashboardMobile";
import FilePreview from "@/components/ui/FilePreview";
import setFotoPublik from "@/utils/setFotoPublik";

import {
  SEPUTAR_PPID,
  LINK_SEPUTAR_PPID,
  INFORMASI_PUBLIK,
  LINK_INFORMASI_PUBLIK,
  LAPORAN,
  LINK_LAPORAN,
  MEDIA_LAYANAN,
  LINK_MEDIA_LAYANAN,
  LINK_FORM,
  UKPBJ,
  LINK_UKPBJ,
} from "../data/data";

const TRANSPARENTMENUS = [
  "/",
  "/seputar-ppid/profile-singkat",
  "/seputar-ppid/visi-misi",
  "/seputar-ppid/struktur",
  "/seputar-ppid/tugas-fungsi-wewenang",
  "/seputar-ppid/lokasi-kontak",
  "/informasi-publik",
  "/laporan",
];

export default function Navbar() {
  // ⬇️ Local state to prevent hydration mismatch
  const [hasMounted, setHasMounted] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  const pathname = usePathname();
  const { isNotFound } = useNotFound();
  const { user } = useAuthContext();
  const { userPublik, isLoading, signOut } = useAuthPublic();
  const [toggle, setToggle] = useState(false);

  const isLight = isNotFound || !TRANSPARENTMENUS.includes(pathname);
  const fotoImage = setFotoPublik(userPublik);

  // Mount check + resize init
  useEffect(() => {
    setHasMounted(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    const handleScroll = () => setScroll(window.scrollY > 50);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setToggle(false);
  }, [pathname]);

  if (!hasMounted) return null;

  const handleLinkClick = () => {
    if (windowWidth <= 991) setToggle(false);
  };

  const renderLink = (item) =>
    item.newtab ? (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex"
      >
        <Icon icon={item.icon} /> {item.label}
      </a>
    ) : (
      <Link href={item.link} className="flex" onClick={handleLinkClick}>
        <Icon icon={item.icon} /> {item.label}
      </Link>
    );

  return (
    <>
      <div
        className={`header ${
          isLight
            ? "header-dark dark navdark"
            : "header-transparent dark navdark"
        } ${scroll ? "header-fixed" : ""}`}
      >
        <div className="container-fluid">
          <nav
            id="navigation"
            className={
              windowWidth > 991
                ? "navigation navigation-landscape"
                : "navigation navigation-portrait"
            }
            aria-label="Navigasi utama"
          >
            {/* === Header === */}
            <div className="nav-header">
              <Link className="nav-brand" href="/" onClick={handleLinkClick}>
                <Image
                  src="/assets/images/brand-color.png"
                  width={166}
                  height={0}
                  sizes="100vw"
                  style={{ width: "166px", height: "auto" }}
                  alt={`Logo ${process.env.NEXT_PUBLIC_HOST || "Website"}`}
                />
              </Link>

              {/* Toggle */}
              <div
                className="nav-toggle"
                role="button"
                tabIndex={0}
                aria-label={
                  toggle ? "Tutup menu navigasi" : "Buka menu navigasi"
                }
                aria-expanded={toggle}
                aria-controls="nav-menus"
                onClick={() => setToggle(!toggle)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setToggle(!toggle);
                  }
                }}
              />

              {/* Mobile icons */}
              <div className="mobile_nav">
                <ul>
                  {user && (
                    <li>
                      <Link href="/admin">
                        <Icon icon="solar:shield-user-broken" />
                      </Link>
                    </li>
                  )}
                  {userPublik ? (
                    <li>
                      <Link data-bs-toggle="offcanvas" href="#offcanvasExample">
                        <FilePreview
                          noLink
                          fileUrl={fotoImage}
                          filename={fotoImage}
                          isUser
                          className="h-6 w-auto rounded"
                        />
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link href="/signin">
                        <Icon icon="solar:user-broken" />
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* === Menu === */}
            <div
              className={`nav-menus-wrapper ${
                toggle ? "nav-menus-wrapper-open" : ""
              }`}
              style={{ transitionProperty: toggle ? "none" : "left" }}
            >
              <div className="mobLogos">
                <Image
                  src="/assets/images/brand-color.png"
                  width={120}
                  height={0}
                  sizes="100vw"
                  style={{ width: "120px", height: "auto" }}
                  alt="Logo"
                />
              </div>

              <span
                className="nav-menus-wrapper-close-button"
                onClick={() => setToggle(false)}
              >
                ✕
              </span>

              <ul className="nav-menu">
                <li className={pathname === "/" ? "active" : ""}>
                  <Link href="/" onClick={handleLinkClick}>
                    Home
                  </Link>
                </li>

                <li
                  className={
                    LINK_SEPUTAR_PPID.includes(pathname) ? "active" : ""
                  }
                >
                  <Link href="#" scroll={false}>
                    Seputar PPID <span className="submenu-indicator" />
                  </Link>
                  <ul className="nav-dropdown nav-submenu">
                    {SEPUTAR_PPID.map((item, i) => (
                      <li
                        key={i}
                        className={pathname === item.link ? "active" : ""}
                      >
                        {renderLink(item)}
                      </li>
                    ))}
                  </ul>
                </li>

                <li className={pathname === "/peraturan" ? "active" : ""}>
                  <Link href="/peraturan" onClick={handleLinkClick}>
                    Peraturan
                  </Link>
                </li>

                <li
                  className={
                    LINK_INFORMASI_PUBLIK.includes(pathname) ? "active" : ""
                  }
                >
                  <Link href="#" scroll={false}>
                    Informasi Publik <span className="submenu-indicator" />
                  </Link>
                  <ul className="nav-dropdown nav-submenu">
                    {INFORMASI_PUBLIK.map((item, i) => (
                      <li
                        key={i}
                        className={pathname === item.link ? "active" : ""}
                      >
                        {renderLink(item)}
                      </li>
                    ))}
                  </ul>
                </li>

                <li className={LINK_LAPORAN.includes(pathname) ? "active" : ""}>
                  <Link href="#" scroll={false}>
                    Laporan <span className="submenu-indicator" />
                  </Link>
                  <ul className="nav-dropdown nav-submenu">
                    {LAPORAN.map((item, i) => (
                      <li
                        key={i}
                        className={pathname === item.link ? "active" : ""}
                      >
                        {renderLink(item)}
                      </li>
                    ))}
                  </ul>
                </li>

                <li
                  className={
                    LINK_MEDIA_LAYANAN.includes(pathname) ? "active" : ""
                  }
                >
                  <Link href="#" scroll={false}>
                    Media Layanan <span className="submenu-indicator" />
                  </Link>
                  <ul className="nav-dropdown nav-submenu">
                    {MEDIA_LAYANAN.map((item, i) => (
                      <li
                        key={i}
                        className={pathname === item.link ? "active" : ""}
                      >
                        {renderLink(item)}
                      </li>
                    ))}
                  </ul>
                </li>

                <li className={LINK_UKPBJ.includes(pathname) ? "active" : ""}>
                  <Link href="#" scroll={false}>
                    UKPBJ <span className="submenu-indicator" />
                  </Link>
                  <ul className="nav-dropdown nav-submenu">
                    {UKPBJ.map((item, i) => (
                      <li
                        key={i}
                        className={pathname === item.link ? "active" : ""}
                      >
                        {renderLink(item)}
                      </li>
                    ))}
                  </ul>
                </li>

                {/* Mobile form */}
                <li>
                  {LINK_FORM.map((item, index) => (
                    <Fragment key={index}>
                      <Link
                        href={item.link}
                        className="mob-addlisting light"
                        onClick={handleLinkClick}
                      >
                        <Icon icon="solar:document-text-broken" /> Form{" "}
                        {item.label}
                      </Link>
                      <br />
                    </Fragment>
                  ))}
                </li>
              </ul>

              {/* Right-side desktop menu */}
              {windowWidth > 991 && (
                <ul className="nav-menu align-to-right d-flex align-items-center">
                  {user && (
                    <li>
                      <Link
                        href="/admin"
                        className={`d-flex align-items-center ${
                          isLight ? "" : "text-white"
                        }`}
                      >
                        <Icon
                          icon="solar:shield-user-broken"
                          width="20"
                          height="20"
                        />
                      </Link>
                    </li>
                  )}
                  <NavbarDashboard
                    isLoading={isLoading}
                    userPublik={userPublik}
                    current={pathname}
                    signOut={signOut}
                  />
                  <li className="nav-dropdown-right">
                    <Link
                      href="#"
                      scroll={false}
                      className="btn btn-sm btn-danger d-inline-flex align-items-center gap-2 rounded px-4 py-0"
                    >
                      <Icon
                        icon="solar:document-text-broken"
                        width="18"
                        height="18"
                      />
                      Formulir
                    </Link>
                    <ul className="nav-dropdown nav-submenu">
                      {LINK_FORM.map((item, index) => (
                        <li
                          key={index}
                          className={pathname === item.link ? "active" : ""}
                        >
                          <Link href={item.link} className="flex">
                            <Icon icon="solar:document-add-broken" />{" "}
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              )}
            </div>
          </nav>
        </div>
      </div>

      <NavbarDashboardMobile
        userPublik={userPublik}
        signOut={signOut}
        location={pathname}
      />
    </>
  );
}
