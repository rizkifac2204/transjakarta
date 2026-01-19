import { verifyAuth } from "@/libs/jwt";
import { getAllShelterTypes } from "@/libs/shelter-type";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";

import QuestionForm from "../../../question/add/_Form";

export const dynamic = "force-dynamic";

const QuestionShelterAddModal = async () => {
  const [auth, types] = await Promise.all([verifyAuth(), getAllShelterTypes()]);
  if (auth.level > 3) notFound();

  return (
    <Modal>
      <Card title={`FORMULIR TAMBAH PERTANYAAN`}>
        <QuestionForm types={types} />
      </Card>
    </Modal>
  );
};

export default QuestionShelterAddModal;
