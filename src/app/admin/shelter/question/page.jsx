import { verifyAuth } from "@/libs/jwt";
import { getAllShelterQuestion } from "@/libs/shelter-question";

import QuestionShelterTable from "./_TableQuestions";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Pertanyaan Halte",
};

const QuestionShelterPage = async () => {
  const [auth, questions] = await Promise.all([
    verifyAuth(),
    getAllShelterQuestion({ include: { shelter_type: true } }),
  ]);

  const modifiedData = questions?.map((q) => {
    return {
      ...q,
      isManage: auth.level < 4,
    };
  });

  return (
    <div>
      <QuestionShelterTable initialData={modifiedData} />
    </div>
  );
};

export default QuestionShelterPage;
