"use client";

import React, { useState } from "react";
import { PATH_UPLOAD } from "@/configs/appConfig";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { decodeId, encodeId } from "@/libs/hash/hashId";
import Icon from "@/components/ui/Icon";
import Link from "next/link";

const columns = [
  {
    label: "No",
    field: "age",
  },
  {
    label: "Judul Informasi",
    field: "label",
  },
  {
    label: "Link",
    field: "link",
  },
  {
    label: "File",
    field: "file",
  },
  {
    label: "",
    field: "aksi",
  },
];

function truncLink(url) {
  if (!url) return "-";
  const displayText = url.length > 30 ? url.slice(0, 20) + "..." : url;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {displayText}
    </a>
  );
}
function truncFile(file) {
  if (!file) return "-";
  const displayText = file.length > 30 ? file.slice(0, 20) + "..." : file;
  return (
    <a
      href={`/api/services/file/uploads/${PATH_UPLOAD.ukpbj.informasi}/${file}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {displayText}
    </a>
  );
}

function ListInfo({ data }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subsubId = decodeId(searchParams.get("subsubId"));
  const [deletingRowId, setDeletingRowId] = useState(null);

  const handleDelete = async (id) => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmed) return;

    setDeletingRowId(id);
    try {
      const res = await axios.delete(`/api/ukpbj/informasi/${id}`);
      toast.success(res?.data?.message || "Berhasil");
      router.refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setDeletingRowId(null);
    }
  };

  if (!data || data.length === 0) {
    return (
      <i className="block text-center text-gray-500 text-sm">
        Data Informasi Tidak Ditemukan,{" "}
        <Link
          className="underline"
          href={`/admin/ukpbj/informasi/add?subsubId=${encodeId(subsubId)}`}
        >
          Tambah Informasi
        </Link>
      </i>
    );
  }

  return (
    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
      <thead className="border-t border-slate-100 dark:border-slate-800">
        <tr>
          {columns.map((column, i) => (
            <th key={i} scope="col" className=" table-th ">
              {column?.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
        {data.map((row, i) => (
          <tr key={i}>
            <td className="table-td">{i + 1}</td>
            <td className="table-td">{row?.label}</td>
            <td className="table-td">{truncLink(row?.link)}</td>
            <td className="table-td">{truncFile(row?.file)}</td>
            <td className="table-td">
              {Boolean(deletingRowId == row.id) ? (
                <Icon
                  icon="line-md:loading-twotone-loop"
                  className="animate-spin"
                />
              ) : (
                <div className="flex space-x-1">
                  <Link
                    href={`/admin/ukpbj/informasi/${encodeId(row.id)}/edit`}
                  >
                    <Icon icon="solar:pen-2-broken" />
                  </Link>
                  <button onClick={() => handleDelete(row.id)}>
                    <Icon icon="solar:trash-bin-2-broken" />
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={5}>
            <Link
              className="flex items-center text-sm p-2"
              href={`/admin/ukpbj/informasi/add?subsubId=${encodeId(subsubId)}`}
            >
              <Icon icon="solar:add-circle-broken" /> Tambah Informasi
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default ListInfo;
