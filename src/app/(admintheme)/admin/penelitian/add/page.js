import React from "react";
import { verifyAuth } from "@/libs/auth";
import { getAdminOnly } from "@/libs/admin";
import Card from "@/components/ui/Card";
import FormAddPenelitian from "./_FormAddPenelitian";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tambah Permohonan Penelitian",
};

async function PenelitianAddPage() {
  const auth = await verifyAuth();
  const admin = await getAdminOnly();
  const isMaster = auth.level < 3;
  const defaultValues = {
    no_regis: "",
    admin_id: auth.id,
    tanggal: null,
    email: "",
    tipe: "",
    judul: "",
    tujuan: "",
    file_permohonan: null,
    file_proposal: null,
    file_pertanyaan: null,
    status: "",
    // start pemohon
    nomor_identitas: "",
    nama: "",
    nim: "",
    universitas: "",
    jurusan: "",
    identitas: null,
    // start jawaban
    jenis: "",
    tanggal_jawaban: null, // tanggal -> tanggal_jawaban
    file_surat_pemberitahuan: null,
    file_informasi: null,
    pesan: "",
    whatsapped: false,
    mailed: false,
  };

  return (
    <Card
      title="FORMULIR TAMBAH PERMOHONAN PENELITIAN"
      subtitle={`*) Wajib Diisi`}
      noborder={false}
    >
      <FormAddPenelitian
        isMaster={isMaster}
        admin={admin}
        defaultValues={defaultValues}
      />
    </Card>
  );
}

export default PenelitianAddPage;
