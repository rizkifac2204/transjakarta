import React from "react";
import { verifyAuth } from "@/libs/auth";
import { getAdminOnly } from "@/libs/admin";
import Card from "@/components/ui/Card";
import FormAddPermohonan from "./_FormAddPermohonan";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tambah Permohonan Informasi",
};

async function PermohonanAddPage() {
  const auth = await verifyAuth();
  const admin = await getAdminOnly();
  const isMaster = auth.level < 3;
  const defaultValues = {
    no_regis: "",
    admin_id: auth.id,
    tanggal: null,
    email: "",
    tipe: "",
    rincian: "",
    tujuan: "",
    cara_dapat: "",
    cara_terima: "",
    identitas: null,
    file_pendukung: null,
    status: "",
    // start jawaban
    jenis: "", // jika jenis diinput, form jawaban lainnya muncul
    tanggal_jawaban: null, // kolom tanggal -> tanggal_jawaban
    bentuk_fisik: "",
    biaya: "",
    jangka_waktu: "",
    penguasaan: "",
    penghitaman: "",
    pengecualian: "",
    pasal: "",
    konsekuensi: "",
    file_surat_pemberitahuan: null,
    file_informasi: null,
    pesan: "",
    whatsapped: false,
    mailed: false,
  };

  return (
    <Card
      title="FORMULIR TAMBAH PERMOHONAN INFORMASI"
      subtitle={`*) Wajib Diisi`}
      noborder={false}
    >
      <FormAddPermohonan
        isMaster={isMaster}
        admin={admin}
        defaultValues={defaultValues}
      />
    </Card>
  );
}

export default PermohonanAddPage;
