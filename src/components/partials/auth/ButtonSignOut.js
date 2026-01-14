"use client";

import Icon from "@/components/ui/Icon";
import { useAuthContext } from "@/providers/auth-provider";

export default function ButtonSignOut() {
  const { signOut } = useAuthContext();
  return (
    <span
      className="inline-flex h-10 w-10 border items-center justify-center rounded-full cursor-pointer"
      onClick={() => {
        signOut();
      }}
    >
      <Icon icon="uit:signout" width="1.2rem" height="1.2rem" />
    </span>
  );
}
