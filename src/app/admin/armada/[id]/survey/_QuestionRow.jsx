"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import FileInputController from "@/components/ui/FileInputController";
import useDebounce from "@/utils/useDebounce";
import Icon from "@/components/ui/Icon";

const ANSWER_OPTIONS = [
  { value: true, label: "Ya" },
  { value: false, label: "Tidak" },
];

const QuestionRow = ({ question, armada_survey_id, initialAnswer }) => {
  const [answer, setAnswer] = useState(initialAnswer?.answer ?? null);
  const [note, setNote] = useState(initialAnswer?.note ?? "");
  const [photoUrl, setPhotoUrl] = useState(initialAnswer?.photo_url ?? null);
  const [lastSaved, setLastSaved] = useState(initialAnswer);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedNote = useDebounce(note, 1000);

  const handlePhotoUpload = async (file) => {
    if (!file) return;

    if (answer !== false) {
      setError("Hanya bisa upload foto jika jawaban 'Tidak'.");
      return;
    }

    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("photo", file);

    const originalPhotoUrl = photoUrl;

    try {
      const response = await fetch(
        `/api/armada/${armada_survey_id}/survey/${question.id}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal mengupload file.");
      }

      setPhotoUrl(result.url);

      const payload = {
        question_id: question.id,
        answer,
        note,
        photo_url: result.url,
      };
      // await saveAnswer(payload);
    } catch (err) {
      setError(err.message);
      setPhotoUrl(originalPhotoUrl); // Rollback on failure
    } finally {
      setIsUploading(false);
    }
  };

  const saveAnswer = useCallback(
    async (payload) => {
      setIsSaving(true);
      setError(null);
      try {
        const res = await axios.post(
          `/api/armada/${armada_survey_id}/survey`,
          payload
        );
        const { payload: savedPayload } = res.data;
        setLastSaved({
          answer: savedPayload.answer,
          note: savedPayload.note,
          photo_url: savedPayload.photo_url,
        });
      } catch (err) {
        setError(err.message);
        setAnswer(lastSaved?.answer ?? null);
        setNote(lastSaved?.note ?? "");
        setPhotoUrl(lastSaved?.photo_url ?? null);
      } finally {
        setIsSaving(false);
      }
    },
    [armada_survey_id, lastSaved]
  );

  const deleteAnswer = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/armada/${armada_survey_id}/survey/${question.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Gagal menghapus jawaban.");
      }
      setLastSaved({ answer: null, note: "", photo_url: null });
      setAnswer(null);
      setPhotoUrl(null);
      setNote("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }, [armada_survey_id, question.id, setLastSaved]);

  useEffect(() => {
    // If the answer is 'Yes', notes are managed by handleSelectChange, not this effect.
    if (answer === true) {
      return;
    }

    const lastSavedNote = lastSaved?.note ?? "";
    // Do not save if the note hasn't meaningfully changed.
    if (debouncedNote === lastSavedNote) {
      return;
    }
    // Do not save a note if no answer has been given yet.
    if (answer === null) {
      return;
    }

    const payload = {
      question_id: question.id,
      answer,
      note: debouncedNote,
      photo_url: photoUrl,
    };
    saveAnswer(payload);
  }, [debouncedNote, answer, photoUrl, question.id, lastSaved, saveAnswer]);

  const handleSelectChange = async (e) => {
    const selectedValue = e.target.value;
    const newAnswer =
      selectedValue === "true"
        ? true
        : selectedValue === "false"
        ? false
        : null;

    // jika tidak ada perubahan, jangan lakukan apa-apa
    if (newAnswer === answer) return;

    setAnswer(newAnswer);

    let payloadNote = note;
    let payloadPhoto = photoUrl;

    if (newAnswer === true) {
      setNote("");
      setPhotoUrl(null);
      payloadNote = "";
      payloadPhoto = null;
    }

    if (newAnswer === null) {
      await deleteAnswer();
    } else {
      const payload = {
        question_id: question.id,
        answer: newAnswer,
        note: payloadNote,
        photo_url: payloadPhoto,
      };
      await saveAnswer(payload);
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
            options={ANSWER_OPTIONS}
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
