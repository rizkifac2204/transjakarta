"use client";

import Tooltip from "@/components/ui/Tooltip";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { encodeId } from "@/libs/hash/hashId";

function ActionJawabanAdd({ permohonan_id }) {
  return (
    <Tooltip
      content="Kembali Ke Halaman Permohonan"
      placement="top"
      arrow
      animation="shift-away"
    >
      <Link
        className="flex items-center space-x-2"
        href={`/admin/permohonan/${encodeId(permohonan_id)}`}
      >
        <Icon icon="solar:alt-arrow-left-bold-duotone" /> Back
      </Link>
    </Tooltip>
  );
}

export default ActionJawabanAdd;
