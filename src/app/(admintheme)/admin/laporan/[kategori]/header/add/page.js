import React from "react";
import { LAPORAN_KATEGORI } from "@/configs/appConfig";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import FormAddLaporanHeader from "./_FormAddLaporanHeader";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const metadata = {
  title: "Tambah Header Laporan",
};

async function LaporanHeaderAddPage({ params }) {
  const { kategori } = await params;
  if (!kategori) {
    notFound();
  }
  if (!LAPORAN_KATEGORI.includes(kategori)) {
    notFound();
  }

  return (
    <Card
      title={`FORMULIR TAMBAH HEADER LAPORAN (${kategori})`}
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/laporan/${kategori}`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormAddLaporanHeader kategori={kategori} />
    </Card>
  );
}

export default LaporanHeaderAddPage;
