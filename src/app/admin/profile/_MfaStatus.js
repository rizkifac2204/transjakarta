"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import Alert from "@/components/ui/Alert";
import Link from "next/link";

function MfaStatus({ profile }) {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);

  const resetMfa = async () => {
    const confirmed = confirm("Apakah Anda yakin ingin reset?");
    if (!confirmed) return;

    setIsResetting(true);
    try {
      const res = await axios.patch(`/api/profile/reset-mfa`, {});
      router.refresh();
      toast.success(res?.data?.message || "Berhasil");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setIsResetting(false);
    }
  };

  if (!profile.mfa_enabled) {
    return (
      <Alert className="alert-outline-warning mb-4">
        Anda belum mengaktifkan fitur MFA, silahkan aktifkan pada halaman{" "}
        <Link href={"/admin/profile/mfa"} className="underline">
          Aktivasi MFA
        </Link>
      </Alert>
    );
  }

  return (
    <Alert className="alert-outline-success flex" icon="heroicons:check-circle">
      Multi-Factor Authentication Aktif -{" "}
      <button
        className="underline"
        type="button"
        onClick={() => resetMfa()}
        disabled={isResetting}
      >
        {isResetting ? "Memproses..." : "Reset MFA"}
      </button>
    </Alert>
  );
}

export default MfaStatus;
