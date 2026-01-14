import React from "react";
import { DIP_KATEGORI } from "@/configs/appConfig";
import { notFound } from "next/navigation";
import { getDipHeaderDetailById } from "@/libs/dip";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormEditDipHeader from "../../../../header/[id]/edit/_FormEditDipHeader";

export const dynamic = "force-dynamic";

async function DipHeaderEditModal({ params }) {
  const { kategori } = await params;
  const id = decodeOrNotFound(params.id);
  if (!kategori) {
    notFound();
  }
  if (!DIP_KATEGORI.includes(kategori)) {
    notFound();
  }
  const data = await getDipHeaderDetailById(String(kategori), parseInt(id));
  if (!data) notFound();

  return (
    <Modal>
      <Card title={`FORMULIR EDIT HEADER DIP (${kategori})`}>
        <FormEditDipHeader data={data} kategori={kategori} />
      </Card>
    </Modal>
  );
}

export default DipHeaderEditModal;
