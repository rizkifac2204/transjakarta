import React from "react";
import {
  getUkpbjRegulasiDetailById,
  getUkpbjRegulasiHeader,
} from "@/libs/ukpbj-regulasi";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Card from "@/components/ui/Card";
import FormEditUkpbjRegulasi from "./_FormEditUkpbjRegulasi";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Regulasi UKPBJ",
};

async function UkpbjRegulasiEditPage({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getUkpbjRegulasiDetailById(parseInt(id));
  const headers = await getUkpbjRegulasiHeader();
  if (!data) notFound();

  return (
    <Card
      title="FORMULIR EDIT DATA REGULASI UKPBJ"
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/ukpbj/regulasi`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormEditUkpbjRegulasi data={data} headers={headers} />
    </Card>
  );
}

export default UkpbjRegulasiEditPage;
