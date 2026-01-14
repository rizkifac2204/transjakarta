import React from "react";
import Card from "@/components/ui/Card";
import { getUISubSubDetailById } from "@/libs/ukpbj-informasi-withsub";
import FormAddUkpbjInformasi from "./_FormAddUkpbjInformasi";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import BackButton from "@/components/ui/BackButton";

export const metadata = {
  title: "Tambah Informasi PBJ",
};

async function UkpbjInformasiAddPage({ searchParams }) {
  const subsubId = decodeOrNotFound((await searchParams).subsubId);
  const header = await getUISubSubDetailById(subsubId);
  if (!header) notFound();

  return (
    <Card
      title="FORMULIR TAMBAH DATA INFORMASI PBJ"
      noborder={false}
      headerslot={<BackButton />}
    >
      <FormAddUkpbjInformasi header={header} />
    </Card>
  );
}

export default UkpbjInformasiAddPage;
