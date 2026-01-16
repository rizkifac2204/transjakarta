"use client";

import { useState, useEffect, useCallback } from "react";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import FileInputController from "@/components/ui/FileInputController";
import useDebounce from "@/utils/useDebounce";
import Icon from "@/components/ui/Icon";

const QuestionRow = ({ question, armada_survey_id, initialAnswer }) => {
  const [answer, setAnswer] = useState(initialAnswer?.answer ?? null);
  const [note, setNote] = useState(initialAnswer?.note ?? "");
  const [photoUrl, setPhotoUrl] = useState(initialAnswer?.photo_url ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedNote = useDebounce(note, 1000);

  // Corrected answerOptions to include placeholder and boolean values
  const answerOptions = [
    { value: "", label: "Pilih Jawaban" }, // Added empty value for placeholder
    { value: true, label: "Ya" },
    { value: false, label: "Tidak" },
  ];

  const handlePhotoUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch("/api/armada/survey/answer/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal mengupload file.");
      }
      setPhotoUrl(result.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const saveAnswer = useCallback(async (payload) => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/armada/survey/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Gagal menyimpan jawaban.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteAnswer = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/armada/survey/answer/${armada_survey_id}/${question.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Gagal menghapus jawaban.");
      }
      // Optionally clear photoUrl and note states locally after deletion
      setPhotoUrl(null);
      setNote("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }, [armada_survey_id, question.id]);

  useEffect(() => {
    const initialAnswerValue = initialAnswer?.answer ?? null;
    const initialNoteValue = initialAnswer?.note ?? "";
    const initialPhotoUrlValue = initialAnswer?.photo_url ?? null;

    const answerChanged = answer !== initialAnswerValue;
    const noteChanged = debouncedNote !== initialNoteValue;
    const photoChanged = photoUrl !== initialPhotoUrlValue;

    // Only proceed if there has been a meaningful change from the initial state
    const hasAnyChange = answerChanged || noteChanged || photoChanged;
    if (!hasAnyChange) {
      return;
    }

    // --- Deletion Logic ---
    // If answer is set to null, and it was previously non-null, then delete the answer
    if (answer === null && initialAnswerValue !== null) {
      deleteAnswer();
      return;
    }

    // --- Saving Logic ---
    // If answer is null (and it was null initially or has become null, and not a deletion scenario),
    // then we don't save.
    if (answer === null) {
      return;
    }

    // Otherwise, save the answer
    const payload = {
      armada_survey_id,
      question_id: question.id,
      answer, // This will be true/false boolean
      note: debouncedNote,
      photo_url: photoUrl,
    };

    saveAnswer(payload);
  }, [
    answer,
    debouncedNote,
    photoUrl,
    initialAnswer, // Included to ensure re-evaluation if initial props change
    armada_survey_id,
    question.id,
    saveAnswer,
    deleteAnswer, // Added deleteAnswer to deps
  ]);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "true") {
      setAnswer(true);
    } else if (selectedValue === "false") {
      setAnswer(false);
    } else {
      setAnswer(null); // For the "Pilih Jawaban" option (value="")
    }
  };

  return (
    <li className="p-4 border rounded-md shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-semibold ">
            {question?.order}. {question.basic}
          </p>
          <p className="text-sm mt-1">
            INDIKATOR: <b>{question.indicator}</b>
          </p>
          <p className="text-sm mt-1">- {question?.spm_criteria}</p>
        </div>
        <div className="w-40">
          <Select
            options={answerOptions}
            value={answer === null ? "" : String(answer)} // HTML <select> expects string values
            onChange={handleSelectChange}
          />
        </div>
      </div>
      {answer === false && (
        <div className="mt-4 space-y-4 border-t pt-4">
          <TextArea
            label="Catatan"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tambahkan catatan mengapa jawaban 'Tidak'..."
          />
          <div>
            {/* <FileInputController
              label="Upload Foto"
              name={`photo-${question.id}`}
              onChange={handlePhotoUpload}
              preview={true}
              initialImageUrl={photoUrl}
              disabled={isUploading}
            /> */}
            {isUploading && (
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Icon
                  icon="line-md:loading-twotone-loop"
                  className="animate-spin mr-2"
                />
                <span>Mengupload...</span>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="h-4 mt-1 text-xs text-right">
        {isSaving && !isUploading && (
          <span className="text-gray-400">Menyimpan...</span>
        )}
        {error && <span className="text-red-500">Error: {error}</span>}
      </div>
    </li>
  );
};

export default QuestionRow;
