"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { LINK_DASHBOARD } from "../data/data";

function NavbarDashboardMobile({ signOut, location }) {
  const closeBtnRef = useRef(null);

  // Fokus otomatis ke tombol close saat navigasi berubah
  useEffect(() => {
    if (closeBtnRef.current) {
      closeBtnRef.current.focus();
    }

    // Tutup offcanvas jika diperlukan (opsional)
    const closeBtn = document.querySelector(".btn-closes");
    if (closeBtn) closeBtn.click();
  }, [location]);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-menu"
      tabIndex={-1}
      id="offcanvasExample"
      aria-labelledby="offcanvasExampleLabel"
      role="dialog"
      aria-modal="true"
    >
      {/* === Header === */}
      <div className="offcanvas-header">
        <h2 id="offcanvasExampleLabel" className="visually-hidden">
          Menu Navigasi Pengguna
        </h2>
        <button
          type="button"
          className="btn-closes"
          data-bs-dismiss="offcanvas"
          aria-label="Tutup menu"
          ref={closeBtnRef}
        >
          ×
        </button>
      </div>

      {/* === Body === */}
      <div className="offcanvas-body">
        <nav aria-label="Navigasi pengguna">
          <ul>
            {LINK_DASHBOARD.map((item, index) => (
              <li key={index}>
                <Link href={item.link}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="#" onClick={signOut} aria-label="Keluar dari akun">
                SignOut
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default NavbarDashboardMobile;
