import React from "react";
import { DIP_KATEGORI } from "@/configs/appConfig";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import FormAddDipHeader from "./_FormAddDipHeader";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const metadata = {
  title: "Tambah Header Dip",
};

async function DipHeaderAddPage({ params }) {
  const { kategori } = await params;
  if (!kategori) {
    notFound();
  }
  if (!DIP_KATEGORI.includes(kategori)) {
    notFound();
  }

  return (
    <Card
      title={`FORMULIR TAMBAH HEADER DIP (${kategori})`}
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/dip/${kategori}`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormAddDipHeader kategori={kategori} />
    </Card>
  );
}

export default DipHeaderAddPage;
