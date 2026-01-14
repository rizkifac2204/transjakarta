import React from "react";
import { DIP_KATEGORI } from "@/configs/appConfig";
import { notFound } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormAddDipHeader from "../../../header/add/_FormAddDipHeader";

async function DipHeaderAddModal({ params }) {
  const { kategori } = await params;
  if (!kategori) {
    notFound();
  }
  if (!DIP_KATEGORI.includes(kategori)) {
    notFound();
  }

  return (
    <Modal>
      <Card title={`FORMULIR TAMBAH HEADER DIP (${kategori})`}>
        <FormAddDipHeader kategori={kategori} />
      </Card>
    </Modal>
  );
}

export default DipHeaderAddModal;
