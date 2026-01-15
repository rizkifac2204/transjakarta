import { verifyAuth } from "@/libs/jwt";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { getArmadaQuestionSetById } from "@/libs/armada-question-set";
import { notFound } from "next/navigation";

import QuestionDetails from "./_Detail";
import TableQuestions from "./_TableQuestions";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Detail Set Pertanyaan Armada",
};

const QuestionSetDetailPage = async ({ params }) => {
  const auth = await verifyAuth();
  const id = decodeOrNotFound(params.questionSetId);
  const initial = await getArmadaQuestionSetById(id);

  if (!initial) {
    notFound();
  }

  const data = {
    ...initial,
    isManage: auth.level < 4,
  };

  return (
    <>
      <div>
        <QuestionDetails initialData={data} />
      </div>

      <div className="mt-2">
        <TableQuestions
          initialData={data?.questions}
          set_id={id}
          isManage={data.isManage}
        />
      </div>
    </>
  );
};

export default QuestionSetDetailPage;
