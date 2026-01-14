"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { decodeId, encodeId } from "@/libs/hash/hashId";
import Alert from "@/components/ui/Alert";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

function ListHeader({ headers }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const headerId = decodeId(searchParams.get("headerId"));
  const [deletingRowId, setDeletingRowId] = useState(null);

  const handleDelete = async (id) => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmed) return;

    setDeletingRowId(id);
    try {
      const res = await axios.delete(`/api/ukpbj/informasi/header/${id}`);
      toast.success(res?.data?.message || "Berhasil");
      router.refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setDeletingRowId(null);
    }
  };

  if (!headers || headers.length === 0) {
    return (
      <Alert
        label="Header Tidak Ditemukan"
        className="alert-info text-black-500"
      />
    );
  }

  return (
    <ul>
      {headers?.map((item, i) => (
        <li key={i} className={`w-full items-center py-2 flex justify-between`}>
          <Link href={`?headerId=${encodeId(item.id)}`} scroll={false}>
            <Badge
              className={`${
                headerId === item.id.toString()
                  ? "bg-danger-600 text-white"
                  : "bg-slate-500 text-white"
              }`}
            >
              {item?.ukpbj_informasi_header_sub?.length || "0"}
            </Badge>{" "}
            {item.label}
          </Link>

          <div
            className={`ml-3 flex items-center ${
              Boolean(deletingRowId == item.id)
                ? "pointer-events-none opacity-50"
                : ""
            }`}
          >
            {Boolean(deletingRowId == item.id) ? (
              <Icon
                icon="line-md:loading-twotone-loop"
                className="animate-spin"
              />
            ) : (
              <div className="flex space-x-1">
                <Link
                  href={`/admin/ukpbj/informasi/head/${encodeId(
                    item.id
                  )}/edit?section=header`}
                >
                  <Icon icon="solar:pen-2-broken" />
                </Link>
                <button onClick={() => handleDelete(item.id)}>
                  <Icon icon="solar:trash-bin-2-broken" />
                </button>
                <Link
                  title="Tambah Sub Header"
                  href={`/admin/ukpbj/informasi/head/add?section=sub&headerId=${
                    encodeId(item?.id) || ""
                  }`}
                >
                  <Icon icon="solar:add-circle-broken" />
                </Link>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ListHeader;
