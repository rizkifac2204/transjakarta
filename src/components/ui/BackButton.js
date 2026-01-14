"use client";

import Icon from "./Icon";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="action-btn"
      href={`/admin/ukpbj/informasi`}
    >
      <Icon icon="solar:alt-arrow-left-bold-duotone" />
    </button>
  );
}
