"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { encodeId } from "@/libs/hash/hashId";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";

function HeaderLaporan({ kategori, data }) {
  const router = useRouter();
  const [deletingRowId, setDeletingRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [safeData, setSafeData] = useState([]);
  const [open, setOpen] = useState(true);

  const toggleAccrodian = () => {
    setOpen(!open);
  };

  useEffect(() => {
    try {
      if (!Array.isArray(data)) {
        setHasError(true);
      } else {
        setSafeData(data);
      }
    } catch (err) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  const handleDelete = async (id) => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmed) return;

    setDeletingRowId(id);
    try {
      const res = await axios.delete(`/api/laporan/${kategori}/header/${id}`);
      toast.success(res?.data?.message || "Berhasil");
      setSafeData((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setDeletingRowId(null);
    }
  };

  if (isLoading) {
    return <p className="text-gray-500 italic">Memuat data Header...</p>;
  }

  if (hasError) {
    return (
      <p className="text-red-500">Data tidak tersedia atau gagal dimuat.</p>
    );
  }

  return (
    <Card
      className="custom-class bg-white"
      title="HEADER"
      headerslot={
        <div className="flex gap-2">
          <Link
            href={`/admin/laporan/${kategori}/header/add`}
            scroll={false}
            className={`shadow-md cursor-pointer px-4 py-2 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-60 rounded-md`}
          >
            ADD
          </Link>
          <div
            className={`flex shadow-md cursor-pointer px-4 py-2 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-60 rounded-md`}
            onClick={() => toggleAccrodian()}
          >
            <span
              className={`text-slate-900 dark:text-white text-[22px] transition-all duration-300 h-5 ${
                open ? "rotate-180 transform" : ""
              }`}
            >
              <Icon icon="heroicons-outline:chevron-down" />
            </span>
          </div>
        </div>
      }
    >
      {open && (
        <div>
          <hr />
          <div className="mt-4">
            {safeData.length == 0 ? (
              <Alert
                label="Header Tidak Ditemukan"
                className="alert-info text-black-500"
              />
            ) : (
              safeData?.map((item, index) => (
                <Badge
                  key={index}
                  label={
                    <div className="flex items-center">
                      <button
                        className={`p-1 border-r ${
                          Boolean(deletingRowId == item.id)
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                        type="button"
                        onClick={() => handleDelete(item.id)}
                      >
                        {Boolean(deletingRowId == item.id) ? (
                          <Icon
                            icon="solar:trash-bin-2-broken"
                            className="animate-spin"
                          />
                        ) : (
                          <Icon icon="solar:trash-bin-2-broken" />
                        )}
                      </button>
                      <Link
                        className={`p-1 border-r ${
                          Boolean(deletingRowId == item.id)
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                        href={`/admin/laporan/${kategori}/header/${encodeId(
                          item.id
                        )}/edit`}
                        scroll={false}
                      >
                        {Boolean(deletingRowId == item.id) ? (
                          <Icon
                            icon="line-md:loading-twotone-loop"
                            className="animate-spin"
                          />
                        ) : (
                          <Icon icon="solar:pen-2-broken" />
                        )}
                      </Link>
                      <p className="text-wrap ml-2">{item.label}</p>
                    </div>
                  }
                  className="btn-gold text-slate-800 dark:text-white  m-1"
                />
              ))
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

export default HeaderLaporan;
