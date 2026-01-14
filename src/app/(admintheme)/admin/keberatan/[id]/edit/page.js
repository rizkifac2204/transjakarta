import React from "react";
import { verifyAuth } from "@/libs/auth";
import { getKeberatanDetailById } from "@/libs/keberatan";
import { notFound } from "next/navigation";
import { getAdmin } from "@/libs/admin";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { encodeId } from "@/libs/hash/hashId";
import Card from "@/components/ui/Card";
import FormEditKeberatan from "./_FormEditKeberatan";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Keberatan",
};

async function KeberatanEditPage({ params }) {
  const auth = await verifyAuth();
  const id = decodeOrNotFound(params.id);
  const data = await getKeberatanDetailById(parseInt(id));
  if (!data) notFound();
  const admin = await getAdmin();
  const isMaster = auth.level < 3;

  const defaultValues = {
    no_regis: data?.no_regis || "",
    admin_id: isMaster ? data?.admin_id || auth.id : data?.admin_id,
    tanggal: data?.tanggal ? new Date(data.tanggal) : null,
    email: data?.email || "",
    nama: data?.nama || "",
    nomor_identitas: data?.nomor_identitas || "",
    kategori: data?.kategori || "",
    telp: data?.telp || "",
    alamat: data?.alamat || "",
    alasan: data?.alasan || "",
    tujuan: data?.tujuan || "",
    identitas: null,
    file_pendukung: null,
    status_file_pendukung: "keep",
    id: data?.id,
  };

  return (
    <Card
      title={`FORMULIR EDIT DATA KEBERATAN`}
      subtitle={`*) Wajib Diisi`}
      headerslot={
        <>
          <Link
            className="action-btn"
            href={`/admin/keberatan/${encodeId(id)}`}
          >
            <Icon icon="solar:eye-broken" />
          </Link>
        </>
      }
      noborder={false}
    >
      <FormEditKeberatan
        data={data}
        admin={admin}
        isMaster={isMaster}
        defaultValues={defaultValues}
      />
    </Card>
  );
}

export default KeberatanEditPage;
