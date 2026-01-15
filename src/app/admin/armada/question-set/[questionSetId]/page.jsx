import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { getQuestionSet } from "./_actions";
import QuestionDetails from "./_QuestionDetails";
import { notFound } from "next/navigation";

const QuestionSetDetailPage = async ({ params }) => {
  const { questionSetId } = params;
  const questionSet = await getQuestionSet(questionSetId);

  if (!questionSet) {
    notFound();
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Armada", href: "/admin/armada" },
          { label: "Question Sets", href: "/admin/armada/question-set" },
          { label: questionSet.description },
        ]}
      />
      <QuestionDetails initialData={questionSet} />
    </div>
  );
};

export default QuestionSetDetailPage;