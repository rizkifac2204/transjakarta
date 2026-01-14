"use client";

import Tooltip from "@/components/ui/Tooltip";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { encodeId } from "@/libs/hash/hashId";

function ActionJawabanDetail({ permohonan_id, jawaban_id }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await axios.delete(
        `/api/permohonan/${permohonan_id}/jawaban/${jawaban_id}`
      );
      router.push(`/admin/permohonan/${encodeId(permohonan_id)}`);
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
      <Tooltip
        content="Kembali Ke Halaman Permohonan"
        placement="top"
        arrow
        animation="shift-away"
      >
        <Link
          className="flex items-center space-x-2"
          href={`/admin/permohonan/${encodeId(permohonan_id)}`}
          scroll={false}
        >
          <Icon icon="solar:alt-arrow-left-bold-duotone" /> Back
        </Link>
      </Tooltip>
      <Tooltip content="Edit" placement="top" arrow animation="shift-away">
        <Link
          className="action-btn"
          href={`/admin/permohonan/${encodeId(
            permohonan_id
          )}/jawaban/${encodeId(jawaban_id)}/edit`}
          scroll={false}
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

export default ActionJawabanDetail;
