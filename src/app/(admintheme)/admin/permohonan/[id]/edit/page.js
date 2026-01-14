import React from "react";
import { verifyAuth } from "@/libs/auth";
import { getPermohonanDetailById } from "@/libs/permohonan";
import { getAdminOnly } from "@/libs/admin";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { encodeId } from "@/libs/hash/hashId";
import Card from "@/components/ui/Card";
import FormEditPermohonan from "./_FormEditPermohonan";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Permohonan",
};

async function PermohonanEditlPage({ params }) {
  const auth = await verifyAuth();
  const id = decodeOrNotFound(params.id);
  const data = await getPermohonanDetailById(parseInt(id));
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
    rincian: data?.rincian || "",
    tujuan: data?.tujuan || "",
    cara_dapat: data?.cara_dapat || "",
    cara_terima: data?.cara_terima || "",
    identitas: null,
    file_pendukung: null,
    status_file_pendukung: "keep",
    status: data?.status || "",
  };

  return (
    <Card
      title={`FORMULIR EDIT PERMOHONAN ${data?.tiket}`}
      subtitle={`*) Wajib Diisi`}
      headerslot={
        <>
          <Link
            className="action-btn"
            href={`/admin/permohonan/${encodeId(id)}`}
          >
            <Icon icon="solar:eye-broken" />
          </Link>
        </>
      }
    >
      <FormEditPermohonan
        data={data}
        admin={admin}
        isMaster={isMaster}
        defaultValues={defaultValues}
      />
    </Card>
  );
}

export default PermohonanEditlPage;
