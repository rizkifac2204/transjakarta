import React from "react";
import { verifyAuth } from "@/libs/auth";
import { notFound } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormAddSlider from "../../add/_FormAddSlider";

export const dynamic = "force-dynamic";

async function SliderAddModal() {
  const auth = await verifyAuth();
  if (auth?.level > 2) notFound();
  return (
    <Modal>
      <Card title="FORMULIR TAMBAH DATA SLIDER">
        <FormAddSlider />
      </Card>
    </Modal>
  );
}

export default SliderAddModal;
