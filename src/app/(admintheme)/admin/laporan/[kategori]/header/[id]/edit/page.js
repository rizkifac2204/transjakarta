import React from "react";
import { LAPORAN_KATEGORI } from "@/configs/appConfig";
import { notFound } from "next/navigation";
import { getLaporanHeaderDetailById } from "@/libs/laporan";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Card from "@/components/ui/Card";
import FormEditLaporanHeader from "./_FormEditLaporanHeader";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Header Laporan",
};

async function LaporanHeaderEditPage({ params }) {
  const { kategori } = await params;
  const id = decodeOrNotFound(params.id);
  if (!kategori) {
    notFound();
  }
  if (!LAPORAN_KATEGORI.includes(kategori)) {
    notFound();
  }
  const data = await getLaporanHeaderDetailById(String(kategori), parseInt(id));
  if (!data) notFound();

  return (
    <Card
      title={`FORMULIR EDIT HEADER LAPORAN (${kategori})`}
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/laporan/${kategori}`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormEditLaporanHeader data={data} kategori={kategori} />
    </Card>
  );
}

export default LaporanHeaderEditPage;
