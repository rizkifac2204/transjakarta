import React from "react";
import { getUkpbjRegulasiHeaderDetailById } from "@/libs/ukpbj-regulasi";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Card from "@/components/ui/Card";
import FormEditUkpbjRegulasiHeader from "./_FormEditUkpbjRegulasiHeader";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Header Regulasi UKPBJ",
};

async function UkpbjRegulasiHeaderEditPage({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getUkpbjRegulasiHeaderDetailById(parseInt(id));
  if (!data) notFound();

  return (
    <Card
      title="FORMULIR EDIT HEADER REGULASI UKPBJ"
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/ukpbj/regulasi`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormEditUkpbjRegulasiHeader data={data} />
    </Card>
  );
}

export default UkpbjRegulasiHeaderEditPage;
