import React from "react";
import { DIP_KATEGORI } from "@/configs/appConfig";
import { getDipHeader, getDipDetailById } from "@/libs/dip";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Card from "@/components/ui/Card";
import FormEditDip from "./_FormEditDip";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit DIP",
};

async function DipEditPage({ params }) {
  const { kategori } = await params;
  const id = decodeOrNotFound(params.id);
  if (!kategori) {
    notFound();
  }
  if (!DIP_KATEGORI.includes(kategori)) {
    notFound();
  }

  const data = await getDipDetailById(String(kategori), parseInt(id));
  const headers = await getDipHeader(String(kategori));
  if (!data) notFound();

  return (
    <Card
      title={`FORMULIR EDIT DIP (${kategori})`}
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/dip/${kategori}`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormEditDip data={data} headers={headers} kategori={kategori} />
    </Card>
  );
}

export default DipEditPage;
