import React from "react";
import { getUkpbjRegulasiHeaderDetailById } from "@/libs/ukpbj-regulasi";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormEditUkpbjRegulasiHeader from "../../../../header/[id]/edit/_FormEditUkpbjRegulasiHeader";

async function UkpbjRegulasiHeaderEditModal({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getUkpbjRegulasiHeaderDetailById(parseInt(id));
  if (!data) notFound();

  return (
    <Modal>
      <Card title="FORMULIR EDIT HEADER REGULASI UKPBJ">
        <FormEditUkpbjRegulasiHeader data={data} />
      </Card>
    </Modal>
  );
}

export default UkpbjRegulasiHeaderEditModal;
