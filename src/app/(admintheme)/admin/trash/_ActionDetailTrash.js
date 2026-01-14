"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";

function ActionDetailTrash({ id, kategori }) {
  const router = useRouter();
  const [processingRowId, setProcessingRowId] = useState(null);

  const handleDelete = async () => {
    const confirmed = confirm(
      "Apakah Anda yakin ingin menghapus data ini secara permanen?"
    );
    if (!confirmed) return;
    setProcessingRowId(id);
    try {
      const res = await axios.delete(`/api/trash/${kategori}/${id}`);
      toast.success(res?.data?.message || "Berhasil");
      router.back();
      setTimeout(() => {
        router.refresh(); // kemungkinan sudah tidak berada di halaman ini
      }, 200);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setProcessingRowId(null);
    }
  };

  const handleRestore = async () => {
    const confirmed = confirm(
      "Apakah Anda yakin ingin mengembalikan data ini?"
    );
    if (!confirmed) return;
    setProcessingRowId(id);
    try {
      const res = await axios.patch(`/api/trash/${kategori}/${id}`);
      toast.success(res?.data?.message || "Berhasil");
      router.back();
      setTimeout(() => {
        router.refresh(); // kemungkinan sudah tidak berada di halaman ini
      }, 200);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setProcessingRowId(null);
    }
  };

  return (
    <div
      className={`flex space-x-1 rtl:space-x-reverse ${
        Boolean(processingRowId) ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <Tooltip content="Restore" placement="top" arrow animation="shift-away">
        <button
          className={`action-btn ${
            Boolean(processingRowId) ? "pointer-events-none opacity-50" : ""
          }`}
          type="button"
          onClick={() => handleRestore()}
        >
          {Boolean(processingRowId) ? (
            <Icon
              icon="line-md:loading-twotone-loop"
              className="animate-spin"
            />
          ) : (
            <Icon icon="solar:restart-square-broken" />
          )}
        </button>
      </Tooltip>

      <Tooltip content="Hapus" placement="top" arrow animation="shift-away">
        <button
          className={`action-btn ${
            Boolean(processingRowId) ? "pointer-events-none opacity-50" : ""
          }`}
          type="button"
          onClick={() => handleDelete()}
        >
          {Boolean(processingRowId) ? (
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

export default ActionDetailTrash;
