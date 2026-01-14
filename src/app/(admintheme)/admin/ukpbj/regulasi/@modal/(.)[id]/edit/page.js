import React from "react";
import {
  getUkpbjRegulasiDetailById,
  getUkpbjRegulasiHeader,
} from "@/libs/ukpbj-regulasi";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormEditUkpbjRegulasi from "../../../[id]/edit/_FormEditUkpbjRegulasi";

export const dynamic = "force-dynamic";

async function UkpbjRegulasiEditModal({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getUkpbjRegulasiDetailById(parseInt(id));
  const headers = await getUkpbjRegulasiHeader();
  if (!data) notFound();

  return (
    <Modal>
      <Card title="FORMULIR EDIT DATA REGUALASI UKPBJ">
        <FormEditUkpbjRegulasi data={data} headers={headers} />
      </Card>
    </Modal>
  );
}

export default UkpbjRegulasiEditModal;
