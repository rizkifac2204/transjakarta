import React from "react";
import Link from "next/link";
import Icon from "../../ui/Icon";
import { LINK_DASHBOARD } from "../data/data";
import FilePreview from "@/components/ui/FilePreview";
import setFotoPublik from "@/utils/setFotoPublik";

function NavbarDashboard({ current, isLoading, userPublik, signOut }) {
  if (isLoading) {
    return (
      <li>
        <span className="text-muted">Memuat pengguna...</span>
      </li>
    );
  }

  if (userPublik) {
    const fotoImage =
      setFotoPublik(userPublik) || "/assets/images/default-user.png";

    return (
      <li
        className={`nav-dropdown-right ${
          [
            "/dashboard",
            "/dashboard/profile",
            "/dashboard/permohonan",
            "/dashboard/keberatan",
          ].includes(current)
            ? "active"
            : ""
        }`}
      >
        <Link href="#" scroll={false} role="button">
          <FilePreview
            noLink
            fileUrl={fotoImage}
            filename={fotoImage}
            isUser={true}
            className="h-5 w-auto rounded"
          />
        </Link>
        <ul className="nav-dropdown nav-submenu">
          {LINK_DASHBOARD.map((item, index) => (
            <li
              key={index}
              className={`${current === item.link ? "active" : ""}`}
            >
              <Link href={item.link} className="flex">
                <Icon icon={item.icon} width="15" height="15" /> {item.label}
              </Link>
            </li>
          ))}

          <li>
            <Link
              href="#"
              className="flex"
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
              <Icon icon="solar:logout-3-broken" /> Sign Out
            </Link>
          </li>
        </ul>
      </li>
    );
  }

  // Jika belum login
  return (
    <li className={["/register", "/signin"].includes(current) ? "active" : ""}>
      <Link href="#" scroll={false} role="button">
        Sign Up/Sign In
        <span className="submenu-indicator">
          <span className="submenu-indicator-chevron"></span>
        </span>
      </Link>
      <ul className="nav-dropdown nav-submenu">
        <li className={current === "/register" ? "active" : ""}>
          <Link href="/register" className="flex">
            <Icon icon="solar:login-3-broken" /> Register
          </Link>
        </li>
        <li className={current === "/signin" ? "active" : ""}>
          <Link href="/signin" className="flex">
            <Icon icon="solar:login-3-bold" /> SignIn
          </Link>
        </li>
      </ul>
    </li>
  );
}

export default NavbarDashboard;
