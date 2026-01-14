"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LINK_DASHBOARD } from "../data/data";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import FilePreview from "@/components/ui/FilePreview";
import { useAuthPublic } from "@/providers/auth-public-provider";
import setFotoPublik from "@/utils/setFotoPublik";

export default function DashboardSidebar() {
  const [current, setCurrent] = useState("");
  const { userPublik, signOut } = useAuthPublic();
  const location = usePathname();
  const fotoImage = setFotoPublik(userPublik);

  useEffect(() => {
    setCurrent(location);
  }, [location]);

  return (
    <div className="user-dashboard-inner h-100 border-end border-2 py-5 p-3 d-lg-block d-none">
      <div className="dashboard_users mb-4">
        <div className="square--80 circle mx-auto mb-1">
          <FilePreview
            noLink
            fileUrl={fotoImage}
            filename={fotoImage}
            isUser={true}
            style={{ width: "100%", height: "100%" }}
            className="img-fluid circle"
          />
        </div>
        <div className="user-nameTitle text-center">
          <h4 className="lh-base fw-semibold text-light mb-0">
            Selamat Datang
          </h4>
          <h6 className="text-light fw-medium opacity-75 mb-0">
            {userPublik?.nama || "Pemohon"}
          </h6>
        </div>
      </div>
      <div className="dashboard_Menu">
        <ul>
          {LINK_DASHBOARD.map((item, index) => (
            <li key={index}>
              <Link
                href={item.link}
                className={`${current === item.link ? "active" : ""}`}
              >
                <Icon icon={item.icon} width="15" height="15" />
                &nbsp; {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="#" onClick={signOut}>
              <Icon icon={"solar:logout-3-broken"} width="15" height="15" />
              &nbsp; SignOut
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
