import { verifyAuth } from "@/libs/jwt";
import { getAllArmadaQuestionSet } from "@/libs/armada-question-set";

import QuestionSetTable from "./_Table";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Set Pertanyaan Armada",
};

const QuestionSetPage = async () => {
  const [auth, questionSets] = await Promise.all([
    verifyAuth(),
    getAllArmadaQuestionSet(),
  ]);

  const modifiedData = questionSets?.map((q) => {
    return {
      ...q,
      isManage: auth.level < 4,
    };
  });

  return (
    <div>
      <QuestionSetTable initialData={modifiedData} />
    </div>
  );
};

export default QuestionSetPage;
