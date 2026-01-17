"use client";

import Card from "@/components/ui/Card";
import QuestionRow from "./_QuestionRow";

const ArmadaForm = ({ initialData, questions }) => {
  if (!questions || questions.length === 0) {
    return (
      <Card title="Formulir Survey">
        <p>Tidak ada pertanyaan yang tersedia untuk konfigurasi survey ini.</p>
      </Card>
    );
  }

  const groupedQuestions = questions.reduce((acc, question) => {
    const { section } = question;
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(question);
    return acc;
  }, {});

  return (
    <Card>
      <div className="space-y-5">
        {Object.entries(groupedQuestions).map(([section, qs]) => (
          <div key={section}>
            <h4 className="mb-4">{section}</h4>
            <ul className="space-y-4">
              {qs.map((question) => {
                const initialAnswer = initialData.answers.find(
                  (a) => a.question_id === question.id
                );
                return (
                  <QuestionRow
                    key={question.id}
                    question={question}
                    armada_survey_id={initialData.id}
                    initialAnswer={initialAnswer}
                  />
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ArmadaForm;
