import React from "react";
import { getPeraturanHeaderDetailById } from "@/libs/peraturan";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormEditPeraturanHeader from "../../../../header/[id]/edit/_FormEditPeraturanHeader";

async function PeraturanHeaderEditModal({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getPeraturanHeaderDetailById(parseInt(id));
  if (!data) notFound();

  return (
    <Modal>
      <Card title="FORMULIR EDIT HEADER PERATURAN">
        <FormEditPeraturanHeader data={data} />
      </Card>
    </Modal>
  );
}

export default PeraturanHeaderEditModal;
