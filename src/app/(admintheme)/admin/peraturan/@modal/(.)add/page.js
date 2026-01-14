import React from "react";
import { getPeraturanHeader } from "@/libs/peraturan";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormAddPeraturan from "../../add/_FormAddPeraturan";

async function PeraturanAddModal() {
  const headers = await getPeraturanHeader();

  return (
    <Modal>
      <Card title="FORMULIR TAMBAH DATA PERATURAN">
        <FormAddPeraturan headers={headers} />
      </Card>
    </Modal>
  );
}

export default PeraturanAddModal;
