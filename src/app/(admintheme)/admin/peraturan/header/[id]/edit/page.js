import React from "react";
import { getPeraturanHeaderDetailById } from "@/libs/peraturan";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Card from "@/components/ui/Card";
import FormEditPeraturanHeader from "./_FormEditPeraturanHeader";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Header Peraturan",
};

async function PeraturanHeaderEditPage({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getPeraturanHeaderDetailById(parseInt(id));
  if (!data) notFound();

  return (
    <Card
      title="FORMULIR EDIT HEADER PERATURAN"
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/peraturan`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormEditPeraturanHeader data={data} />
    </Card>
  );
}

export default PeraturanHeaderEditPage;
