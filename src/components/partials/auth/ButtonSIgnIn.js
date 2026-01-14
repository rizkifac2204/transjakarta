"use client";

import Icon from "@/components/ui/Icon";

export default function ButtonSignIn({ provider, icon }) {
  return (
    <span
      className="inline-flex h-10 w-10 border items-center justify-center rounded-full cursor-pointer"
      onClick={() => {
        console.log("IN");
      }}
    >
      <Icon icon={icon} width="1.2rem" height="1.2rem" />
    </span>
  );
}
