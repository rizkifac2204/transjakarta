import React from "react";
import { DIP_KATEGORI } from "@/configs/appConfig";
import { getDipHeader, getDipDetailById } from "@/libs/dip";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormEditDip from "../../../[id]/edit/_FormEditDip";

export const dynamic = "force-dynamic";

async function DipEditModal({ params }) {
  const { kategori } = await params;
  const id = decodeOrNotFound(params.id);
  if (!kategori) {
    notFound();
  }
  if (!DIP_KATEGORI.includes(kategori)) {
    notFound();
  }

  const data = await getDipDetailById(String(kategori), parseInt(id));
  const headers = await getDipHeader(String(kategori));
  if (!data) notFound();

  return (
    <Modal>
      <Card title={`FORMULIR EDIT DIP (${kategori})`}>
        <FormEditDip data={data} headers={headers} kategori={kategori} />
      </Card>
    </Modal>
  );
}

export default DipEditModal;
