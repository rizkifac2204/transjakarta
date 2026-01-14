import React from "react";
import DetailRow from "@/components/ui/DetailRow";
import { formatedDate } from "@/utils/formatDate";
import FilePreview from "@/components/ui/FilePreview";
import { PATH_UPLOAD } from "@/configs/appConfig";
import SendMailAndWa from "@/app/(admintheme)/admin/permohonan/[id]/_SendMailAndWa";

function getInitials(text) {
  if (!text) return "-";
  return text
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getJenisColor(jenis) {
  switch (jenis) {
    case "Respon Awal":
      return "bg-blue-100 text-blue-800";
    case "Respon Lanjutan":
      return "bg-yellow-100 text-yellow-800";
    case "Respon Perbaikan":
      return "bg-orange-100 text-orange-800";
    case "Respon Final":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function ContentJawabanDetail({ data, isModal = false }) {
  return (
    <>
      <div
        className={`flex gap-2 ${
          isModal ? "flex-col" : "flex-col md:flex-row"
        }`}
      >
        <div className={`w-full space-y-2 ${isModal ? "border-b pb-2" : ""}`}>
          <div className="flex items-center gap-3 pb-3">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-md ${getJenisColor(
                data?.jenis
              )} text-sm font-semibold`}
            >
              {getInitials(data?.jenis)}
            </div>
            <h2 className="font-semibold truncate">{data?.jenis || "-"}</h2>
          </div>

          <DetailRow
            label="Tanggal Respon"
            value={formatedDate(data?.tanggal, true)}
          />

          <div className="py-5 border-b">
            {data?.pesan || "- Tidak Ada Pesan"}
          </div>

          <SendMailAndWa
            data={data}
            section="penelitian"
            foreignKey="penelitian_id"
          />
        </div>

        <div className="flex gap-2 flex-col md:flex-row">
          <div className="w-full mx-auto">
            <FilePreview
              fileUrl={
                data?.file_surat_pemberitahuan
                  ? `/api/services/file/uploads/${PATH_UPLOAD.jawabanpenelitian.pemberitahuan}/${data?.file_surat_pemberitahuan}`
                  : null
              }
              filename={data?.file_surat_pemberitahuan || "File Pemberitahuan"}
              label="File Pemberitahuan"
            />
          </div>
          <div className="w-full mx-auto">
            <FilePreview
              fileUrl={
                data?.file_informasi
                  ? `/api/services/file/uploads/${PATH_UPLOAD.jawabanpenelitian.informasi}/${data?.file_informasi}`
                  : null
              }
              filename={data?.file_informasi || "File Informasi"}
              label="File Informasi"
            />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between gap-2 mt-3">
        <p className="font-thin text-xs">
          Dibuat : {formatedDate(data?.created_at, true, true)}
        </p>
        <p className="font-thin text-xs text-right">
          Update Terakhir : {formatedDate(data?.updated_at, true, true)}
        </p>
      </div>
    </>
  );
}

export default ContentJawabanDetail;
