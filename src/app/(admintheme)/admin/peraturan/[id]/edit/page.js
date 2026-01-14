import React from "react";
import { getPeraturanDetailById, getPeraturanHeader } from "@/libs/peraturan";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Card from "@/components/ui/Card";
import FormEditPeraturan from "./_FormEditPeraturan";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Peraturan",
};

async function PeraturanEditPage({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getPeraturanDetailById(parseInt(id));
  const headers = await getPeraturanHeader();
  if (!data) notFound();

  return (
    <Card
      title="FORMULIR EDIT DATA PERATURAN"
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/peraturan`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormEditPeraturan data={data} headers={headers} />
    </Card>
  );
}

export default PeraturanEditPage;
