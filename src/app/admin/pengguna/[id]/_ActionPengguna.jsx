"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import axios from "axios";
import { toast } from "react-toastify";

function ActionPengguna({ id }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResettting, setIsResetting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus user ini?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await axios.delete(`/api/pengguna/${id}`);
      router.push("/admin/pengguna");
      setTimeout(() => {
        router.refresh();
      }, 200);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetMfa = async () => {
    const confirmed = confirm("Apakah Anda yakin ingin reset MFA user ini?");
    if (!confirmed) return;

    setIsResetting(true);
    try {
      await axios.patch(`/api/pengguna/${id}/reset-mfa`, {});
      toast.success("Berhasil reset MFA");
      router.refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div
      className={`flex space-x-1 ${
        isDeleting ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <Tooltip content="Reset MFA" placement="top" arrow animation="shift-away">
        <button
          className="action-btn"
          type="button"
          onClick={() => handleResetMfa()}
        >
          {isResettting ? (
            <Icon
              icon="line-md:loading-twotone-loop"
              className="animate-spin"
            />
          ) : (
            <Icon icon="solar:refresh-circle-broken" />
          )}
        </button>
      </Tooltip>
      <Tooltip
        content="Hapus Pengguna"
        placement="top"
        arrow
        animation="shift-away"
      >
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

export default ActionPengguna;
