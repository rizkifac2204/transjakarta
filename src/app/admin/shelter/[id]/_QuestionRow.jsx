"use client";

import { useShelterContext } from "@/providers/shelter-provider";
import { PATH_UPLOAD } from "@/configs/appConfig";
import FilePreview from "@/components/ui/FilePreview";

const QuestionRow = ({ question, initialAnswer }) => {
  const { shelter } = useShelterContext();
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
          {initialAnswer?.answer ? "YA" : "TIDAK"}
        </div>
      </div>

      {initialAnswer?.answer === false && (
        <div className="mt-4 space-y-4 border-t pt-4">
          <p>Catatan: {initialAnswer?.note || "-"}</p>

          <div>
            <FilePreview
              fileUrl={
                initialAnswer?.photo_url
                  ? `/api/services/file/uploads/${PATH_UPLOAD.shelter}/${shelter?.id}/${initialAnswer?.photo_url}`
                  : null
              }
              filename={initialAnswer?.photo_url || "Image"}
              width={100}
            />
          </div>
        </div>
      )}
    </li>
  );
};

export default QuestionRow;
