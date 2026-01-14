import React from "react";
import { LAPORAN_KATEGORI } from "@/configs/appConfig";
import { notFound } from "next/navigation";
import { getLaporanHeaderDetailById } from "@/libs/laporan";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormEditLaporanHeader from "../../../../header/[id]/edit/_FormEditLaporanHeader";

export const dynamic = "force-dynamic";

async function LaporanHeaderEditModal({ params }) {
  const { kategori } = await params;
  const id = decodeOrNotFound(params.id);
  if (!kategori) {
    notFound();
  }
  if (!LAPORAN_KATEGORI.includes(kategori)) {
    notFound();
  }
  const data = await getLaporanHeaderDetailById(String(kategori), parseInt(id));
  if (!data) notFound();

  return (
    <Modal>
      <Card title={`FORMULIR EDIT HEADER LAPORAN (${kategori})`}>
        <FormEditLaporanHeader data={data} kategori={kategori} />
      </Card>
    </Modal>
  );
}

export default LaporanHeaderEditModal;
