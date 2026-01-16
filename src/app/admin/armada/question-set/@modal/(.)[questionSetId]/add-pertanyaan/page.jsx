import { verifyAuth } from "@/libs/jwt";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { getArmadaQuestionSetById } from "@/libs/armada-question-set";
import { notFound } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";

import QuestionForm from "../../../[questionSetId]/add-pertanyaan/_Form";

export const dynamic = "force-dynamic";

const QuestionAddModal = async ({ params }) => {
  const auth = await verifyAuth();
  if (auth.level > 3) notFound();

  const id = decodeOrNotFound(params.questionSetId);
  const set = await getArmadaQuestionSetById(id);

  return (
    <Modal>
      <Card
        title={`FORMULIR TAMBAH PERTANYAAN`}
        subtitle={
          <>
            <span>{set.service_types.map((st) => st.name).join(", ")}</span>
            <br />
            <span>{set.fleet_types.map((st) => st.name).join(", ")}</span>
          </>
        }
      >
        <QuestionForm set={set} />
      </Card>
    </Modal>
  );
};

export default QuestionAddModal;
