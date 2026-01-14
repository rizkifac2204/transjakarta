import React from "react";
import { LAPORAN_KATEGORI } from "@/configs/appConfig";
import { getLaporanHeader, getLaporanDetailById } from "@/libs/laporan";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormEditLaporan from "../../../[id]/edit/_FormEditLaporan";

export const dynamic = "force-dynamic";

async function LaporanEditModal({ params }) {
  const { kategori } = await params;
  const id = decodeOrNotFound(params.id);
  if (!kategori) {
    notFound();
  }
  if (!LAPORAN_KATEGORI.includes(kategori)) {
    notFound();
  }

  const data = await getLaporanDetailById(String(kategori), parseInt(id));
  const headers = await getLaporanHeader(String(kategori));
  if (!data) notFound();

  return (
    <Modal>
      <Card title={`FORMULIR EDIT LAPORAN (${kategori})`}>
        <FormEditLaporan data={data} headers={headers} kategori={kategori} />
      </Card>
    </Modal>
  );
}

export default LaporanEditModal;
