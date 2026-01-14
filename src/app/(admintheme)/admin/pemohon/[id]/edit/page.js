import React from "react";
import { notFound } from "next/navigation";
import { getPemohonDetailById } from "@/libs/pemohon";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { encodeId } from "@/libs/hash/hashId";
import Card from "@/components/ui/Card";
import FormEditPemohon from "./_FormEditPemohon";
import Link from "next/link";
import Icons from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Pemohon",
};

async function PemohonEditPage({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getPemohonDetailById(parseInt(id));
  if (!data) notFound();

  return (
    <Card
      title="FORMULIR EDIT DATA PEMOHON"
      headerslot={
        <Link className="action-btn" href={`/admin/pemohon/${encodeId(id)}`}>
          <Icons icon="solar:eye-broken" />
        </Link>
      }
      noborder={false}
    >
      <FormEditPemohon data={data} />
    </Card>
  );
}

export default PemohonEditPage;
