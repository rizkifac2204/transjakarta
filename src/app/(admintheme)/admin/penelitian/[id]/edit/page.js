import React from "react";
import { verifyAuth } from "@/libs/auth";
import { getPenelitianDetailById } from "@/libs/penelitian";
import { getAdminOnly } from "@/libs/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { encodeId } from "@/libs/hash/hashId";
import Card from "@/components/ui/Card";
import FormEditPenelitian from "./_FormEditPenelitian";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Permohonan Penelitian",
};

async function PenelitianEditlPage({ params }) {
  const auth = await verifyAuth();
  const id = decodeOrNotFound(params.id);
  const data = await getPenelitianDetailById(parseInt(id));
  const admin = await getAdminOnly();
  const isMaster = auth.level < 3;
  if (!data) notFound();

  const defaultValues = {
    id: data?.id,
    no_regis: data?.no_regis || "",
    admin_id: isMaster ? data?.admin_id || auth.id : data?.admin_id,
    tanggal: data?.tanggal ? new Date(data.tanggal) : null,
    tipe: data?.tipe || "",
    email: data?.email || "",
    judul: data?.judul || "",
    tujuan: data?.tujuan || "",
    file_permohonan: null,
    file_proposal: null,
    file_pertanyaan: null,
    status_file_permohonan: "keep",
    status_file_proposal: "keep",
    status_file_pertanyaan: "keep",
    status: data?.status || "",
    // pemohon (akan diisi jika memasukan email baru)
    nomor_identitas: data?.pemohon?.nomor_identitas || "",
    nama: data?.pemohon?.nama || "",
    nim: data?.pemohon?.nim || "",
    universitas: data?.pemohon?.universitas || "",
    jurusan: data?.pemohon?.jurusan || "",
    identitas: null,
  };

  return (
    <Card
      title={`FORMULIR EDIT PERMOHONAN PENELITIAN ${
        data?.no_regis ? data?.no_regis : data?.tiket
      }`}
      subtitle={`*) Wajib Diisi`}
      headerslot={
        <>
          <Link
            className="action-btn"
            href={`/admin/penelitian/${encodeId(id)}`}
          >
            <Icon icon="solar:eye-broken" />
          </Link>
        </>
      }
    >
      <FormEditPenelitian
        data={data}
        admin={admin}
        isMaster={isMaster}
        defaultValues={defaultValues}
      />
    </Card>
  );
}

export default PenelitianEditlPage;
