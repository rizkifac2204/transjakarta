import React from "react";
import { notFound } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { getPemohonDetailById } from "@/libs/pemohon";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Card from "@/components/ui/Card";
import FormEditPemohon from "../../../[id]/edit/_FormEditPemohon";

export const dynamic = "force-dynamic";

async function PemohonEditModal({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getPemohonDetailById(parseInt(id));
  if (!data) notFound();

  return (
    <Modal>
      <Card title="FORMULIR EDIT DATA PEMOHON">
        <FormEditPemohon data={data} />
      </Card>
    </Modal>
  );
}

export default PemohonEditModal;
