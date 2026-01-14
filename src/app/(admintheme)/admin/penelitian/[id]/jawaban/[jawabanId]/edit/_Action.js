"use client";

import Tooltip from "@/components/ui/Tooltip";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { encodeId } from "@/libs/hash/hashId";

function ActionJawabanEdit({ penelitian_id, jawaban_id }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await axios.delete(
        `/api/penelitian/${penelitian_id}/jawaban/${jawaban_id}`
      );
      router.push(`/admin/penelitian/${encodeId(penelitian_id)}`);
    } catch (error) {
      console.log(error);
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
      <Tooltip content="Detail" placement="top" arrow animation="shift-away">
        <Link
          className="action-btn"
          href={`/admin/penelitian/${encodeId(
            penelitian_id
          )}/jawaban/${encodeId(jawaban_id)}`}
          scroll={false}
        >
          <Icon icon="solar:eye-broken" />
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

export default ActionJawabanEdit;
