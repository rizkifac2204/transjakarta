import React from "react";
import { getPeraturanDetailById, getPeraturanHeader } from "@/libs/peraturan";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormEditPeraturan from "../../../[id]/edit/_FormEditPeraturan";

export const dynamic = "force-dynamic";

async function PeraturanEditModal({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getPeraturanDetailById(parseInt(id));
  const headers = await getPeraturanHeader();
  if (!data) notFound();

  return (
    <Modal>
      <Card title="FORMULIR EDIT DATA PERATURAN">
        <FormEditPeraturan data={data} headers={headers} />
      </Card>
    </Modal>
  );
}

export default PeraturanEditModal;
