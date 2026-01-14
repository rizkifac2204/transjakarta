"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Select from "@/components/ui/Select";
import DetailRow from "@/components/ui/DetailRow";

const optionPermohonan = [
  { value: "Proses", label: "Proses" },
  { value: "Diberikan", label: "Diberikan" },
  { value: "Diberikan Sebagian", label: "Diberikan Sebagian" },
  {
    value: "Tidak Dapat Diberikan",
    label: "Tidak Dapat Diberikan",
  },
  { value: "Sengketa", label: "Sengketa" },
  { value: "Ditolak", label: "Ditolak" },
];

const optionPenelitian = [
  { value: "Proses", label: "Proses" },
  { value: "Diberikan", label: "Diberikan" },
  {
    value: "Tidak Dapat Diberikan",
    label: "Tidak Dapat Diberikan",
  },
  { value: "Ditolak", label: "Ditolak" },
  { value: "Hold", label: "Hold" },
];

function FormStatus({ data, section = "permohonan" }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(data?.status ? data?.status : "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${section}/${data?.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: value }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Gagal Merubah Data");
        return;
      }

      toast.success("Berhasil merubah Status Pemohonan");
      setEditing(false);
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error("Terjadi Kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DetailRow
      label="Status Permohonan"
      value={
        editing ? (
          <div className="flex gap-2 items-center">
            <Select
              name="status"
              options={
                section === "permohonan" ? optionPermohonan : optionPenelitian
              }
              disabled={loading}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            {loading ? (
              "..."
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className=" text-sm px-2 py-1 rounded"
                >
                  Simpan
                </button>
                <button
                  onClick={() => {
                    setValue(data?.admin_id || "");
                    setEditing(false);
                  }}
                  className="text-sm px-2 py-1 rounded"
                >
                  Batal
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <span>{value || "-"}</span>
            <button
              onClick={() => setEditing(true)}
              className="text-blue-500 hover:underline text-sm"
              title="Edit"
            >
              ✏️
            </button>
          </div>
        )
      }
    />
  );
}

export default FormStatus;
