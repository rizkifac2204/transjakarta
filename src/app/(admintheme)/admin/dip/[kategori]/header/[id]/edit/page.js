import React from "react";
import { DIP_KATEGORI } from "@/configs/appConfig";
import { notFound } from "next/navigation";
import { getDipHeaderDetailById } from "@/libs/dip";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Card from "@/components/ui/Card";
import FormEditDipHeader from "./_FormEditDipHeader";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Header DIP",
};

async function DipHeaderEditPage({ params }) {
  const { kategori } = await params;
  const id = decodeOrNotFound(params.id);
  if (!kategori) {
    notFound();
  }
  if (!DIP_KATEGORI.includes(kategori)) {
    notFound();
  }
  const data = await getDipHeaderDetailById(String(kategori), parseInt(id));
  if (!data) notFound();

  return (
    <Card
      title={`FORMULIR EDIT HEADER DIP (${kategori})`}
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/dip/${kategori}`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormEditDipHeader data={data} kategori={kategori} />
    </Card>
  );
}

export default DipHeaderEditPage;
