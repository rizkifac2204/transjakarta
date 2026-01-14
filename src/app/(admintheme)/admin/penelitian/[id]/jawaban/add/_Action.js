"use client";

import Tooltip from "@/components/ui/Tooltip";
import Link from "next/link";
import { encodeId } from "@/libs/hash/hashId";
import Icon from "@/components/ui/Icon";

function ActionJawabanAdd({ penelitian_id }) {
  return (
    <Tooltip
      content="Kembali Ke Halaman Permohonan"
      placement="top"
      arrow
      animation="shift-away"
    >
      <Link
        className="flex items-center space-x-2"
        href={`/admin/penelitian/${encodeId(penelitian_id)}`}
      >
        <Icon icon="solar:alt-arrow-left-bold-duotone" /> Back
      </Link>
    </Tooltip>
  );
}

export default ActionJawabanAdd;
