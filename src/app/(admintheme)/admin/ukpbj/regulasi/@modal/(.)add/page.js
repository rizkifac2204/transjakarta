import React from "react";
import { getUkpbjRegulasiHeader } from "@/libs/ukpbj-regulasi";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormAddUkpbjRegulasi from "../../add/_FormAddUkpbjRegulasi";

async function UkpbjRegulasiAddModal() {
  const headers = await getUkpbjRegulasiHeader();

  return (
    <Modal>
      <Card title="FORMULIR TAMBAH DATA REGULASI UKPBJ">
        <FormAddUkpbjRegulasi headers={headers} />
      </Card>
    </Modal>
  );
}

export default UkpbjRegulasiAddModal;
