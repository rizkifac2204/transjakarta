"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Tooltip from "@/components/ui/Tooltip";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import axios from "axios";
import { toast } from "react-toastify";
import { encodeId } from "@/libs/hash/hashId";

function ActionDetailHalaman({ data }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await axios.delete(`/api/halaman/${data.id}`);
      toast.success(res?.data?.message || "Berhasil");
      router.push("/admin/halaman");
      router.refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`flex space-x-1 ${
        isDeleting ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <Tooltip content="Edit" placement="top" arrow animation="shift-away">
        <Link
          className="action-btn"
          href={`/admin/halaman/${encodeId(data.id)}/edit`}
        >
          <Icon icon="solar:pen-2-broken" />
        </Link>
      </Tooltip>
      <Tooltip content="Hapus" placement="top" arrow animation="shift-away">
        <button
          className="action-btn"
          type="button"
          onClick={() => handleDelete()}
        >
          {isDeleting ? (
            <Icon
              icon="line-md:loading-twotone-loop"
              className="animate-spin"
            />
          ) : (
            <Icon icon="solar:trash-bin-2-broken" />
          )}
        </button>
      </Tooltip>
    </div>
  );
}

export default ActionDetailHalaman;
