import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Icon from "./Icon";
import menuItems from "@/configs/menuItems";

const Breadcrumbs = () => {
  const location = usePathname();
  const locationName = location.replace("/", "");

  const [isHide, setIsHide] = useState(true);
  const [groupTitle, setGroupTitle] = useState("");

  useEffect(() => {
    const currentMenuItem = menuItems.find(
      (item) => item.link?.replace("/", "") === locationName
    );

    const currentChild = menuItems.find((item) =>
      item.child?.find(
        (child) => child.childlink?.replace("/", "") === locationName
      )
    );

    if (currentMenuItem) {
      setIsHide(currentMenuItem.isHide);
    } else if (currentChild) {
      setIsHide(currentChild?.isHide || false);
      setGroupTitle(currentChild?.title);
    }
  }, [location, locationName]);

  return (
    <>
      {!isHide ? (
        <div className="md:mb-6 mb-4 flex space-x-3 rtl:space-x-reverse">
          <ul className="breadcrumbs">
            <li className="text-yellow-600">
              <Link href="/admin" className="text-lg">
                <Icon icon="heroicons-outline:home" />
              </Link>
              <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
                <Icon icon="heroicons:chevron-right" />
              </span>
            </li>
            {groupTitle && (
              <li className="text-yellow-600">
                <button type="button" className="capitalize">
                  {groupTitle}
                </button>
                <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
                  <Icon icon="heroicons:chevron-right" />
                </span>
              </li>
            )}
            <li className="capitalize text-slate-500 dark:text-slate-400">
              {locationName.split("/").pop()}
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
};

export default Breadcrumbs;
