"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import Badge from "@/components/ui/Badge";

function SendMailAndWa({ data, section, foreignKey }) {
  const router = useRouter();
  const [isProcess, setIsProcess] = useState(false);

  const handleClick = async (type) => {
    const konfirmasi = window.confirm(`Apakah ingin mengirim ${type} kembali?`);
    if (!konfirmasi) return;

    setIsProcess(type);
    const url = `/api/${section}/${data[foreignKey]}/jawaban/${data?.id}/resend-notif?type=${type}`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(
          result.message || `${type.toUpperCase()} berhasil dikirim`
        );
        router.refresh();
      } else {
        toast.error(result.message || `Gagal mengirim ${type.toUpperCase()}`);
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat mengirim");
    } finally {
      setIsProcess(false);
    }
  };

  return (
    <div className="flex gap-1">
      <button
        onClick={() => handleClick("whatsapp")}
        disabled={Boolean(isProcess)}
      >
        <Badge
          label={
            isProcess === "whatsapp"
              ? "Memproses..."
              : Boolean(data.whatsapped)
              ? "Sended"
              : "Not Sent"
          }
          icon="ic:baseline-whatsapp"
          className={` ${
            Boolean(data.whatsapped) ? "bg-green-500" : "bg-danger-500"
          }  text-white pill`}
        />
      </button>

      <button
        onClick={() => handleClick("email")}
        disabled={Boolean(isProcess)}
      >
        <Badge
          label={
            isProcess === "email"
              ? "Memproses..."
              : Boolean(data.mailed)
              ? "Sended"
              : "Not Sent"
          }
          icon="ic:outline-email"
          className={` ${
            Boolean(data.mailed) ? "bg-green-500" : "bg-danger-500"
          }  text-white pill`}
        />
      </button>
    </div>
  );
}

export default SendMailAndWa;
