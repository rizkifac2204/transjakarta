"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { encodeId } from "@/libs/hash/hashId";
import Icons from "@/components/ui/Icon";

function ActionDetailPemohon({ data }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await axios.delete(`/api/pemohon/${data?.id}`);
      router.push("/admin/pemohon");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 ${
        isDeleting ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <Link
        className="btn-outline-dark w-full px-8 py-1 flex items-center justify-center rounded-md"
        href={`/admin/pemohon/${encodeId(data?.id)}/edit`}
        scroll={false}
      >
        <Icons icon="solar:pen-2-broken" className={"mr-2"} />
        Edit
      </Link>
      <Button
        className={`btn-outline-dark px-8 py-1`}
        text="Hapus"
        isLoading={isDeleting}
        icon="solar:trash-bin-2-broken"
        onClick={() => handleDelete()}
      />
    </div>
  );
}

export default ActionDetailPemohon;
