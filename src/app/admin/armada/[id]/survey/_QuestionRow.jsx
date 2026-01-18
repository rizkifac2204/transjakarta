"use client";

import { useState, useEffect, useCallback } from "react";
import { useArmadaContext } from "@/providers/armada-provider";
import axios from "axios";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import ImageUpload from "@/components/ui/ImageUpload";
import useDebounce from "@/utils/useDebounce";
import { MAX_FOTO_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import Icon from "@/components/ui/Icon";

const ANSWER_OPTIONS = [
  { value: true, label: "Ya" },
  { value: false, label: "Tidak" },
];

const QuestionRow = ({ question, armada_survey_id, initialAnswer }) => {
  const { setArmada } = useArmadaContext();
  const [answer, setAnswer] = useState(initialAnswer?.answer ?? null);
  const [note, setNote] = useState(initialAnswer?.note ?? "");
  const [progress, setProgress] = useState(0);
  const [photoUrl, setPhotoUrl] = useState(initialAnswer?.photo_url ?? null);
  const [lastSaved, setLastSaved] = useState(initialAnswer);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedNote = useDebounce(note, 1000);

  const handlePhotoUpload = async (file) => {
    if (file && answer === false) {
      setIsUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append("photo", file);

      try {
        const response = await axios.post(
          `/api/armada/${armada_survey_id}/survey/${question.id}/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (event) => {
              setProgress(Math.round((event.loaded * 100) / event.total));
            },
          },
        );

        const newPhotoUrl = response.data?.payload?.photo_url;
        setPhotoUrl(newPhotoUrl);
        setArmada((prev) => ({ ...prev, finish: false }));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsUploading(false);
      }
    } else if (!file && photoUrl) {
      setIsUploading(true);
      setError(null);

      try {
        await axios.delete(
          `/api/armada/${armada_survey_id}/survey/${question.id}/upload`,
        );
        setPhotoUrl(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const saveAnswer = useCallback(
    async (payload) => {
      setIsSaving(true);
      setError(null);
      try {
        const res = await axios.post(
          `/api/armada/${armada_survey_id}/survey`,
          payload,
        );
        const { payload: savedPayload } = res.data;
        setLastSaved({
          answer: savedPayload.answer,
          note: savedPayload.note,
          photo_url: savedPayload.photo_url,
        });
        setArmada((prev) => ({ ...prev, finish: false }));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setAnswer(lastSaved?.answer ?? null);
        setNote(lastSaved?.note ?? "");
        setPhotoUrl(lastSaved?.photo_url ?? null);
      } finally {
        setIsSaving(false);
      }
    },
    [armada_survey_id, lastSaved, setArmada],
  );

  const deleteAnswer = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/armada/${armada_survey_id}/survey/${question.id}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Gagal menghapus jawaban.");
      }
      setLastSaved({ answer: null, note: "", photo_url: null });
      setAnswer(null);
      setPhotoUrl(null);
      setNote("");
      setArmada((prev) => ({ ...prev, finish: false }));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsSaving(false);
    }
  }, [armada_survey_id, question.id, setArmada]);

  useEffect(() => {
    if (answer === true) return;
    if (debouncedNote === (lastSaved?.note ?? "")) return;
    if (answer === null) return;

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
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <p className="font-semibold">
            {question?.order}. {question.basic}
          </p>

          <p className="text-sm mt-1">
            INDIKATOR: <b>{question.indicator}</b>
          </p>

          <p className="text-sm mt-1">- {question?.spm_criteria}</p>
        </div>

        <div className="w-full lg:w-40">
          <Select
            options={ANSWER_OPTIONS}
            value={answer === null ? "" : String(answer)}
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
            <ImageUpload
              label={photoUrl ? "Ubah Foto Bukti" : "Unggah Foto Bukti"}
              name={`photo-${question.id}`}
              onChange={handlePhotoUpload}
              initialImageUrl={
                photoUrl
                  ? `/api/services/file/uploads/${PATH_UPLOAD.armada}/${photoUrl}`
                  : null
              }
              disabled={isUploading}
              maxFileSize={MAX_FOTO_SIZE}
            />
            {isUploading && (
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Icon
                  icon="line-md:loading-twotone-loop"
                  className="animate-spin mr-2"
                />
                <span>Mengupload... ({progress}%)</span>
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
