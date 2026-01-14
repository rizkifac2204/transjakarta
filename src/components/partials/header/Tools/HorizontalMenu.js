"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
const topMenu = [
  {
    title: "Menu",
    icon: "solar:hamburger-menu-broken",
    link: "#",
    child: [
      {
        childtitle: "Dashboard",
        childlink: "/admin",
        childicon: "solar:home-broken",
      },
      {
        childtitle: "Profile",
        childlink: "admin/profile",
        childicon: "solar:user-broken",
      },
      {
        childtitle: "Pengguna",
        childlink: "admin/pengguna",
        childicon: "solar:shield-user-broken",
      },
    ],
  },

  {
    title: "Main",
    icon: "heroicons-outline:chip",
    link: "#",
    child: [
      {
        childtitle: "Permohonan",
        childlink: "/admin/permohonan",
        childicon: "solar:database-broken",
      },
      {
        childtitle: "Keberatan",
        childlink: "/admin/keberatan",
        childicon: "solar:palette-broken",
      },
      {
        childtitle: "Penelitian",
        childlink: "/admin/penelitian",
        childicon: "solar:square-academic-cap-2-broken",
      },

      {
        childtitle: "Pemohon",
        childlink: "/admin/pemohon",
        childicon: "solar:user-id-broken",
      },
    ],
  },

  {
    title: "Data",
    icon: "heroicons-outline:view-boards",
    link: "#",
    megamenu: [
      {
        megamenutitle: "Peraturan",
        megamenuicon: "heroicons-outline:user",
        singleMegamenu: [
          {
            m_childtitle: "Data Peraturan",
            m_childlink: "/admin/peraturan",
          },
        ],
      },

      {
        megamenutitle: "Daftar Informasi",
        megamenuicon: "heroicons-outline:user",
        singleMegamenu: [
          {
            m_childtitle: "Berkala",
            m_childlink: "/admin/dip/berkala",
          },
          {
            m_childtitle: "Serta Merta",
            m_childlink: "/admin/dip/serta-merta",
          },
          {
            m_childtitle: "tersedia Setiap Saat",
            m_childlink: "/admin/dip/tersedia-setiap-saat",
          },
        ],
      },
      {
        megamenutitle: "Laporan",
        megamenuicon: "heroicons-outline:user",
        singleMegamenu: [
          {
            m_childtitle: "Akses Informasi Publik",
            m_childlink: "/admin/laporan/akses-informasi-publik",
          },
          {
            m_childtitle: "Layanan Informasi Publik",
            m_cchildlink: "/admin/laporan/layanan-informasi-publik",
          },
          {
            m_childtitle: "Survei Informasi Publik",
            m_childlink: "/admin/laporan/survei-informasi-publik",
          },
        ],
      },
      {
        megamenutitle: "UKPBJ",
        megamenuicon: "heroicons-outline:user",
        singleMegamenu: [
          {
            m_childtitle: "Regulasi",
            m_childlink: "/admin/ukpbj/regulasi",
          },
          {
            m_childtitle: "Informasi",
            m_childlink: "/admin/ukpbj/informasi",
          },
        ],
      },
    ],
  },

  {
    title: "Support",
    icon: "heroicons-outline:template",
    child: [
      {
        childtitle: "Whatsapp",
        childlink: "/admin/whatsapp",
        childicon: "ic:baseline-whatsapp",
      },
      {
        childtitle: "Trash",
        childlink: "/admin/trash",
        childicon: "solar:trash-bin-minimalistic-2-broken",
      },
      {
        childtitle: "Testimoni",
        childlink: "/admin/testimoni",
        childicon: "solar:stars-outline",
      },
      {
        childtitle: "Instansi",
        childlink: "/admin/instansi",
        childicon: "solar:buildings-broken",
      },
      {
        childtitle: "Infografis",
        childlink: "/admin/chart",
        childicon: "solar:chart-square-broken",
      },
      {
        childtitle: "Slider",
        childlink: "/admin/slider",
        childicon: "solar:slider-vertical-minimalistic-outline",
      },
      {
        childtitle: "Tampilan Website",
        childlink: "/admin/halaman",
        childicon: "solar:display-broken",
      },
    ],
  },
];

const HorizontalMenu = () => {
  const location = usePathname();
  return (
    <div className="main-menu">
      <ul>
        {topMenu?.map((item, i) => (
          <li
            key={i}
            className={
              item.child
                ? "menu-item-has-children"
                : "" || item.megamenu
                ? "menu-item-has-children has-megamenu"
                : ""
            }
          >
            {/* Single menu*/}
            {!item.child && !item.megamenu && (
              <Link href={`${item.link}`}>
                <div className="flex flex-1 items-center space-x-[6px] rtl:space-x-reverse">
                  <span className="icon-box">
                    <Icon icon={item.icon} />
                  </span>
                  <div className="text-box">{item.title}</div>
                </div>
              </Link>
            )}
            {/* has dropdown*/}
            {(item.child || item.megamenu) && (
              <a>
                <div className="flex flex-1 items-center space-x-[6px] rtl:space-x-reverse">
                  <span className="icon-box">
                    <Icon icon={item.icon} />
                  </span>
                  <div className="text-box">{item.title}</div>
                </div>
                <div className="flex-none text-sm ltr:ml-3 rtl:mr-3 leading-[1] relative top-1">
                  <Icon icon="heroicons-outline:chevron-down" />
                </div>
              </a>
            )}
            {/* Dropdown menu*/}
            {item.child && (
              <ul className="sub-menu">
                {item.child.map((childitem, index) => (
                  <li key={index}>
                    <Link href={`${childitem.childlink}`}>
                      <div className="flex space-x-2 items-start rtl:space-x-reverse">
                        <Icon
                          icon={childitem.childicon}
                          className="leading-[1] text-base"
                        />
                        <span className="leading-[1]">
                          {childitem.childtitle}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {/* Megamenu*/}
            {item.megamenu && (
              <div className="rt-mega-menu">
                <div className="flex flex-wrap space-x-8 justify-between rtl:space-x-reverse">
                  {item.megamenu.map((m_item, m_i) => (
                    <div key={m_i}>
                      {/* mega menu title*/}
                      <div className="text-sm font-medium text-slate-900 dark:text-white mb-2 flex space-x-1 items-center">
                        {/* <Icon icon={m_item.megamenuicon} /> */}
                        <span> {m_item.megamenutitle}</span>
                      </div>
                      {/* single menu item*/}
                      {m_item.singleMegamenu.map((ms_item, ms_i) => (
                        <Link href={`${ms_item.m_childlink}`} key={ms_i}>
                          <div className="flex items-center space-x-2 text-[15px] leading-6 rtl:space-x-reverse">
                            <span
                              className={`h-[6px] w-[6px] rounded-full border border-slate-600 dark:border-white inline-block flex-none ${
                                location === ms_item.m_childlink
                                  ? " bg-slate-900 dark:bg-white"
                                  : ""
                              }`}
                            ></span>
                            <span
                              className={`capitalize ${
                                location === ms_item.m_childlink
                                  ? " text-slate-900 dark:text-white font-medium"
                                  : "text-slate-600 dark:text-slate-300"
                              }`}
                            >
                              {ms_item.m_childtitle}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HorizontalMenu;
