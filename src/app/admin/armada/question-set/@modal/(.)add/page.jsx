import { verifyAuth } from "@/libs/jwt";
import { getAllFleetType, getAllServicesType } from "@/libs/armada-services";
import { notFound } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";

import QuestionSetForm from "../../add/_Form";

export const dynamic = "force-dynamic";

const QuestionSetAddModal = async () => {
  const auth = await verifyAuth();
  if (auth.level > 3) notFound();

  const [serviceTypes, fleetTypes] = await Promise.all([
    getAllServicesType(),
    getAllFleetType(),
  ]);

  return (
    <Modal>
      <Card title={`FORMULIR TAMBAH SET PERTANYAAN`}>
        <QuestionSetForm serviceTypes={serviceTypes} fleetTypes={fleetTypes} />
      </Card>
    </Modal>
  );
};

export default QuestionSetAddModal;
