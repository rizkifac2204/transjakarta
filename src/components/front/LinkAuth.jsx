"use client";
import React from "react";
import Link from "next/link";
import { useAuthPublic } from "@/providers/auth-public-provider";

const DisplayPermohonanAuth = () => {
  return (
    <>
      <p className="text-muted text-center">
        Untuk dapat melihat progress permohonan, kamu bisa kunjungi halaman
        dasboard kamu pada link berikut
      </p>

      <div className="d-flex gap-3 mt-4 justify-content-center">
        <Link
          href="/dashboard"
          className="btn btn-sm btn-outline-primary rounded-pill px-4"
          scroll={false}
        >
          Dashbord
        </Link>
      </div>
    </>
  );
};

const DisplayKeberatanAuth = () => {
  return (
    <>
      <p className="text-muted text-center">
        Untuk dapat melihat riwayat pengajuan keberatan, kamu bisa kunjungi
        halaman dasboard kamu pada link berikut
      </p>

      <div className="d-flex gap-3 mt-4 justify-content-center">
        <Link
          href="/dashboard"
          className="btn btn-sm btn-outline-primary rounded-pill px-4"
          scroll={false}
        >
          Dashbord
        </Link>
      </div>
    </>
  );
};

const DisplayPermohonanUnAuth = () => {
  return (
    <>
      <p className="mt-4 mb-3 text-muted text-center">
        Status permohonan akan kamu terima melalui Whatsapp dan Email secara
        berkala. Harap catat dan simpan <strong>tiket</strong> dengan baik.
        Tiket berguna untuk memeriksa status permohonan Kamu kapan saja melalui
        formulir cek permohonan.
      </p>
      <p className="text-muted text-center">
        Untuk kemudahan dalam mengelola permohonan, Kamu dapat melakukan
        pendaftaran. Dengan akun terdaftar, Kamu akan memiliki akses ke{" "}
        <strong>riwayat permohonan</strong>, serta kemudahan dalam pemantauan
        permohonan berikutnya.
      </p>

      <div className="d-flex gap-3 mt-4 justify-content-center">
        <Link
          href="/register"
          className="btn btn-sm btn-outline-primary rounded-pill px-4"
          scroll={false}
        >
          Daftar Akun
        </Link>
        <Link
          href="/signin"
          className="btn btn-sm btn-outline-primary rounded-pill px-4"
          scroll={false}
        >
          Masuk
        </Link>
      </div>
    </>
  );
};

const DisplayKeberatanUnAuth = () => {
  return (
    <>
      <p className="text-muted text-center">
        Untuk kemudahan dalam mengelola keberatan, Kamu dapat melakukan
        pendaftaran. Dengan akun terdaftar, Kamu akan memiliki akses ke{" "}
        <strong>riwayat pengajuan keberatan</strong>, serta kemudahan dalam
        pemantauan pengjuan berikutnya.
      </p>

      <div className="d-flex gap-3 mt-4 justify-content-center">
        <Link
          href="/register"
          className="btn btn-sm btn-outline-primary rounded-pill px-4"
          scroll={false}
        >
          Daftar Akun
        </Link>
        <Link
          href="/signin"
          className="btn btn-sm btn-outline-primary rounded-pill px-4"
          scroll={false}
        >
          Masuk
        </Link>
      </div>
    </>
  );
};

function LinkAuth({ section }) {
  const { userPublik } = useAuthPublic();
  if (!section) return null;

  if (userPublik) {
    if (section === "keberatan") {
      return <DisplayKeberatanAuth />;
    } else {
      return <DisplayPermohonanAuth />;
    }
  } else {
    if (section === "keberatan") {
      return <DisplayKeberatanUnAuth />;
    } else {
      return <DisplayPermohonanUnAuth />;
    }
  }

  return null;
}

export default LinkAuth;
