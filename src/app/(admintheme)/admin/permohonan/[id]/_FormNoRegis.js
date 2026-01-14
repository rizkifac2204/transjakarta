"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import Textinput from "@/components/ui/TextInput";
import DetailRow from "@/components/ui/DetailRow";

function FormNoRegis({ data, section = "permohonan" }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(data?.no_regis ? data?.no_regis : "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${section}/${data?.id}/no-regis`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ no_regis: value }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Gagal Merubah Data");
        return;
      }

      toast.success("Berhasil merubah No Registrasi");
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
      label="No. Registrasi"
      value={
        editing ? (
          <div className="flex gap-2 items-center">
            <Textinput
              className="text-xs px-2 py-1"
              name="no_regis"
              id="no_regis"
              placeholder="Masukan Nomor Registrasi"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={loading}
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
                    setValue(data?.no_regis);
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

export default FormNoRegis;
