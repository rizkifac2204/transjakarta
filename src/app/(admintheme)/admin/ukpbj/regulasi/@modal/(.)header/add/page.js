import React from "react";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormAddUkpbjRegulasiHeader from "../../../header/add/_FormAddUkpbjRegulasiHeader";

async function UkpbjRegulasiHeaderAddModal() {
  return (
    <Modal>
      <Card title="FORMULIR TAMBAH HEADER REGULASI UKPBJ">
        <FormAddUkpbjRegulasiHeader />
      </Card>
    </Modal>
  );
}

export default UkpbjRegulasiHeaderAddModal;
