import React from "react";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormAddPeraturanHeader from "../../../header/add/_FormAddPeraturanHeader";

async function PeraturanHeaderAddModal() {
  return (
    <Modal>
      <Card title="FORMULIR TAMBAH HEADER PERATURAN">
        <FormAddPeraturanHeader />
      </Card>
    </Modal>
  );
}

export default PeraturanHeaderAddModal;
