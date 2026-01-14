import React from "react";
import { LAPORAN_KATEGORI } from "@/configs/appConfig";
import { notFound } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormAddLaporanHeader from "../../../header/add/_FormAddLaporanHeader";

async function LaporanHeaderAddModal({ params }) {
  const { kategori } = await params;
  if (!kategori) {
    notFound();
  }
  if (!LAPORAN_KATEGORI.includes(kategori)) {
    notFound();
  }

  return (
    <Modal>
      <Card title={`FORMULIR TAMBAH HEADER LAPORAN (${kategori})`}>
        <FormAddLaporanHeader kategori={kategori} />
      </Card>
    </Modal>
  );
}

export default LaporanHeaderAddModal;
