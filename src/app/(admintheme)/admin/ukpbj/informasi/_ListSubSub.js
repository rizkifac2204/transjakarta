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
import ListInfo from "./_ListInfo";

function ListSubSub({ subsubs, headerId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subsubId = decodeId(searchParams.get("subsubId"));
  const [deletingRowId, setDeletingRowId] = useState(null);

  const handleDelete = async (id) => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmed) return;

    setDeletingRowId(id);
    try {
      const res = await axios.delete(`/api/ukpbj/informasi/sub-sub/${id}`);
      toast.success(res?.data?.message || "Berhasil");
      router.refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setDeletingRowId(null);
    }
  };

  if (!subsubs || subsubs.length === 0) {
    return (
      <i className="block text-center text-gray-500 text-sm">
        Sub SubHeader Tidak Ditemukan
      </i>
    );
  }

  return (
    <>
      {subsubs?.map((item, index) => (
        <div key={index} className="py-2">
          <div className="flex items-center flex-1 border p-2 rounded-lg">
            <Link
              href={`?headerId=${encodeId(headerId)}&subId=${encodeId(
                item.header_sub_id
              )}&subsubId=${encodeId(item.id)}`}
            >
              <Badge
                className={`${
                  subsubId === item.id.toString()
                    ? "bg-danger-600 text-white"
                    : "bg-slate-500 text-white"
                }`}
              >
                {item?.ukpbj_informasi?.length || "0"}
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
                    )}/edit?section=subsub`}
                  >
                    <Icon icon="solar:pen-2-broken" />
                  </Link>
                  <button onClick={() => handleDelete(item.id)}>
                    <Icon icon="solar:trash-bin-2-broken" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {String(subsubId) === item.id.toString() ? (
            <>
              <div className="my-4">
                <ListInfo data={item?.ukpbj_informasi} />
              </div>
            </>
          ) : null}
        </div>
      ))}
    </>
  );
}

export default ListSubSub;
