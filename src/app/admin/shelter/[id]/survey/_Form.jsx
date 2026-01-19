"use client";

import { useShelterContext } from "@/providers/shelter-provider";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

import QuestionRowInput from "./_QuestionRowInput";

const ShelterForm = ({ questions }) => {
  const [finishing, setFinishing] = useState(null);
  const { shelter, setShelter } = useShelterContext();

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

  const handleFinish = async (id) => {
    const confirmed = confirm(
      "Apakah Anda yakin ingin menyelesaikan survey ini?",
    );
    if (!confirmed) return;

    setFinishing(true);
    try {
      const res = await axios.patch(`/api/shelter/${id}/survey`);
      toast.success(res.data.message || "Berhasil Menyelesaikan Survey");
      setShelter((prev) => ({ ...prev, finish: true }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setFinishing(false);
    }
  };

  return (
    <Card>
      <div className="space-y-5">
        {Object.entries(groupedQuestions).map(([section, qs]) => (
          <div key={section}>
            <h4 className="mb-4">{section}</h4>
            <ul className="space-y-4">
              {qs.map((question) => {
                const initialAnswer = shelter.answers.find(
                  (a) => a.question_id === question.id,
                );
                return (
                  <QuestionRowInput
                    key={question.id}
                    question={question}
                    initialAnswer={initialAnswer}
                  />
                );
              })}
            </ul>
          </div>
        ))}

        {shelter.finish ? (
          <Alert className="alert-outline-success mb-4">
            Survey Sudah Diselesaikan
          </Alert>
        ) : (
          <Button
            className="btn-primary w-full btn-sm"
            onClick={() => handleFinish(shelter.id)}
            disabled={finishing}
          >
            {finishing ? "Menyelesaikan..." : "Selesaikan Survey"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ShelterForm;
