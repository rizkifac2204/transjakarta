import { useAuthContext } from "@/providers/auth-provider";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import Icon from "@/components/ui/Icon";
import useMobileMenu from "@/themes/dashcode/hooks/useMobileMenu";
import Submenu from "./Submenu";
import { useWhatsappContext } from "@/providers/whatsapp-provider";

const Badge = ({ value, whatsapp, isWhatsapp }) => {
  if (!value) return null;
  if (isWhatsapp) return <span className="menu-badge">{whatsapp?.status}</span>;
  return <span className="menu-badge">{value}</span>;
};

import menuItems from "@/configs/menuItems";

export default function Navmenu() {
  const { whatsapp } = useWhatsappContext();
  const { user } = useAuthContext();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [mobileMenu, setMobileMenu] = useMobileMenu();
  const locationName = usePathname();
  const userLevel = user?.level;

  const filteredMenu = menuItems
    .map((item) => {
      // Langsung skip jika tidak punya akses
      if (item.access_level && !item.access_level.includes(userLevel)) {
        return null;
      }

      // Jika ada anak (child), lakukan filter juga
      if (item.child) {
        const filteredChild = item.child.filter(
          (child) =>
            !child.access_level || child.access_level.includes(userLevel)
        );

        // Jika setelah difilter tidak ada child yang tersisa, skip juga
        if (filteredChild.length === 0) return null;

        return { ...item, child: filteredChild };
      }

      return item;
    })
    .filter(Boolean);

  const toggleSubmenu = (i) => {
    if (activeSubmenu === i) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(i);
    }
  };

  useEffect(() => {
    let submenuIndex = null;
    filteredMenu.map((item, i) => {
      if (!item.child) return;
      if (item.link === locationName) {
        submenuIndex = null;
      } else {
        const ciIndex = item.child.findIndex(
          (ci) => ci.childlink === locationName
        );
        if (ciIndex !== -1) {
          submenuIndex = i;
        }
      }
    });

    setActiveSubmenu(submenuIndex);

    if (mobileMenu) {
      setMobileMenu(false);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationName]);

  return (
    <>
      <ul>
        {filteredMenu.map((item, i) => (
          <li
            key={i}
            className={` single-sidebar-menu 
              ${item.child ? "item-has-children" : ""}
              ${activeSubmenu === i ? "open" : ""}
              ${locationName === item.link ? "menu-item-active" : ""}`}
          >
            {/* only for menulabel */}
            {item.isHeader && !item.child && (
              <div className="menulabel">{item.title}</div>
            )}

            {/* single menu with no children */}
            {!item.child && !item.isHeader && (
              <Link
                className="menu-link"
                href={item.link}
                onClick={() => toggleSubmenu(i)}
              >
                <span className="menu-icon flex-grow-0">
                  <Icon icon={item.icon} />
                </span>
                <div className="text-box flex-grow">{item.title}</div>
                <Badge
                  value={item.badge}
                  whatsapp={whatsapp}
                  isWhatsapp={item.title == "Whatsapp"}
                />
              </Link>
            )}

            {/* !!sub menu parent */}
            {item.child && (
              <div
                className={`menu-link ${
                  activeSubmenu === i
                    ? "parent_active not-collapsed"
                    : "collapsed"
                }`}
                onClick={() => toggleSubmenu(i)}
              >
                <div className="flex-1 flex items-start">
                  <span className="menu-icon">
                    <Icon icon={item.icon} />
                  </span>
                  <div className="text-box">{item.title}</div>
                </div>
                <div className="flex-0">
                  <div
                    className={`menu-arrow transform transition-all duration-300 ${
                      activeSubmenu === i ? " rotate-90" : ""
                    }`}
                  >
                    <Icon icon="heroicons-outline:chevron-right" />
                  </div>
                </div>
              </div>
            )}

            <Submenu
              activeSubmenu={activeSubmenu}
              item={item}
              i={i}
              locationName={locationName}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
