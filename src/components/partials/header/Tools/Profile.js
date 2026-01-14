import React from "react";
import Link from "next/link";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu } from "@headlessui/react";
import Image from "next/image";
import { useAuthContext } from "@/providers/auth-provider";

const ProfileLabel = (session) => {
  return (
    <div className="flex items-center">
      <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
        <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full relative">
          <Image
            src="/assets/images/user.png"
            alt=""
            fill
            sizes="33vw"
            className="block w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap w-[85px] block">
          {session?.nama}
        </span>
        <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
          <Icon icon="heroicons-outline:chevron-down"></Icon>
        </span>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, isLoading, signOut } = useAuthContext();

  const ProfileMenu = [
    {
      label: "Profile",
      icon: "heroicons-outline:user",
      href: "/admin/profile",
    },
    {
      label: "Halaman Awal",
      icon: "heroicons-outline:home",
      href: "/",
    },
    {
      label: "Logout",
      icon: "heroicons-outline:login",
      action: () => signOut(),
    },
  ];

  if (isLoading)
    return (
      <div className="animate-pulse rounded-lg bg-slate-500 lg:h-[32px] lg:w-[150px]"></div>
    );

  return (
    <Dropdown label={ProfileLabel(user)} classMenuItems="w-[180px] top-[58px]">
      {ProfileMenu.map((item, index) => (
        <Menu.Item key={index}>
          {({ active }) => {
            const itemClass = `
              ${
                active
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                  : "text-slate-600 dark:text-slate-300"
              }
              block w-full text-left px-4 py-2
              ${
                item.hasDivider
                  ? "border-t border-slate-100 dark:border-slate-700"
                  : ""
              }
            `;

            const content = (
              <div className="flex items-center">
                <span className="text-xl ltr:mr-3 rtl:ml-3">
                  <Icon icon={item.icon} />
                </span>
                <span className="text-sm">{item.label}</span>
              </div>
            );

            if (item.href) {
              return (
                <Link href={item.href} className={itemClass}>
                  {content}
                </Link>
              );
            }

            return (
              <button type="button" onClick={item.action} className={itemClass}>
                {content}
              </button>
            );
          }}
        </Menu.Item>
      ))}
    </Dropdown>
  );
};

export default Profile;
