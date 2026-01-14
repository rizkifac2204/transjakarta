"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { encodeId } from "@/libs/hash/hashId";

import Select from "@/components/ui/Select";
import DetailRow from "@/components/ui/DetailRow";

function FormPenanggungJawab({ admins, data, section = "permohonan" }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(data?.admin_id ? data?.admin_id : "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${section}/${data?.id}/penanggungjawab`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ penanggungjawabId: value }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Gagal Merubah Data");
        return;
      }

      toast.success("Berhasil merubah Penanggung Jawab");
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
      label="Penanggung Jawab"
      value={
        editing ? (
          <div className="flex gap-2 items-center">
            <Select
              name="admin_id"
              options={
                Array.isArray(admins)
                  ? admins.map((item) => ({
                      value: item.id,
                      label: item.nama,
                    }))
                  : []
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
            <Link
              href={`/admin/pengguna/${encodeId(value)}`}
              className="underline"
            >
              {data?.admin?.nama}
            </Link>
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

export default FormPenanggungJawab;
