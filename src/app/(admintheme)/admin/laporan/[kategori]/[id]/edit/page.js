import React from "react";
import { LAPORAN_KATEGORI } from "@/configs/appConfig";
import { getLaporanHeader, getLaporanDetailById } from "@/libs/laporan";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Card from "@/components/ui/Card";
import FormEditLaporan from "./_FormEditLaporan";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Laporan",
};

async function LaporanEditPage({ params }) {
  const { kategori } = await params;
  const id = decodeOrNotFound(params.id);
  if (!kategori) {
    notFound();
  }
  if (!LAPORAN_KATEGORI.includes(kategori)) {
    notFound();
  }

  const data = await getLaporanDetailById(String(kategori), parseInt(id));
  const headers = await getLaporanHeader(String(kategori));
  if (!data) notFound();

  return (
    <Card
      title={`FORMULIR EDIT LAPORAN (${kategori})`}
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/laporan/${kategori}`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormEditLaporan data={data} headers={headers} kategori={kategori} />
    </Card>
  );
}

export default LaporanEditPage;
