import React from "react";
import { getUIDetailById } from "@/libs/ukpbj-informasi-withsub";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Card from "@/components/ui/Card";
import FormEditUkpbjInformasi from "./_FormEditUkpbjInformasi";
import BackButton from "@/components/ui/BackButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Informasi UKPBJ",
};

async function UkpbjInformasiEditPage({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getUIDetailById(parseInt(id));
  if (!data) notFound();

  return (
    <Card
      title="FORMULIR EDIT DATA INFORMASI PBJ"
      noborder={false}
      headerslot={<BackButton />}
    >
      <FormEditUkpbjInformasi data={data} />
    </Card>
  );
}

export default UkpbjInformasiEditPage;
