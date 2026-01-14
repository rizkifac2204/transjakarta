"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { decodeId, encodeId } from "@/libs/hash/hashId";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

function ListSub({ subs }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subId = decodeId(searchParams.get("subId"));
  const [deletingRowId, setDeletingRowId] = useState(null);

  const handleDelete = async (id) => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmed) return;

    setDeletingRowId(id);
    try {
      const res = await axios.delete(`/api/ukpbj/informasi/sub/${id}`);
      toast.success(res?.data?.message || "Berhasil");
      router.refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setDeletingRowId(null);
    }
  };

  if (!subs || subs.length === 0) {
    return (
      <i className="block text-center text-gray-500 text-sm">
        Sub Header Tidak Ditemukan
      </i>
    );
  }

  return (
    <>
      {subs?.map((item, index) => (
        <div key={index} className="mb-4 border-b pb-2">
          <div className="flex items-center flex-1">
            <Link
              href={`?headerId=${encodeId(item.header_id)}&subId=${encodeId(
                item.id
              )}`}
              scroll={false}
            >
              <Badge
                className={`${
                  subId === item.id.toString()
                    ? "bg-danger-600 text-white"
                    : "bg-slate-500 text-white"
                }`}
              >
                {item?.ukpbj_informasi_header_sub_sub?.length || "0"}
              </Badge>{" "}
              {item?.label}
            </Link>

            <div
              className={`ml-3 ${
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
                    )}/edit?section=sub`}
                  >
                    <Icon icon="solar:pen-2-broken" />
                  </Link>
                  <button onClick={() => handleDelete(item.id)}>
                    <Icon icon="solar:trash-bin-2-broken" />
                  </button>
                  <Link
                    title="Tambah Sub SubHeader"
                    href={`/admin/ukpbj/informasi/head/add?section=subsub&headerId=${
                      encodeId(item?.id) || ""
                    }`}
                  >
                    <Icon icon="solar:add-circle-broken" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default ListSub;
