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

  return (
    <div>
      <QuestionSetTable initialData={questionSets} />
    </div>
  );
};

export default QuestionSetPage;
