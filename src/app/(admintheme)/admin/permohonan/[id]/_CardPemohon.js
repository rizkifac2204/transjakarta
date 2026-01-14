import Card from "@/components/ui/Card";
import Link from "next/link";
import FilePreview from "@/components/ui/FilePreview";
import { PATH_UPLOAD } from "@/configs/appConfig";
import { encodeId } from "@/libs/hash/hashId";

function CardPemohon({ pemohon }) {
  return (
    <Card>
      <div className="flex flex-col items-center p-4">
        <h6 className="mb-2">IDENTITAS</h6>
        <FilePreview
          fileUrl={
            pemohon?.identitas
              ? `/api/services/file/uploads/${PATH_UPLOAD.identitas}/${pemohon?.identitas}`
              : null
          }
          filename={pemohon?.identitas || "Idenitas Pemohon"}
          isUser={true}
        />

        {Boolean(pemohon) ? (
          <>
            <h2 className="text-lg font-semibold">{pemohon?.nama || "-"}</h2>
            <p className="text-sm">☎️ {pemohon?.telp || "-"}</p>
            <div className="flex space-x-1 mt-2">
              <Link
                href={`/admin/pemohon/${encodeId(pemohon?.id)}`}
                className="btn-dark rounded-[999px] px-3 text-sm"
              >
                Detail
              </Link>
              <Link
                href={`/admin/pemohon/${encodeId(pemohon?.id)}/edit`}
                className="btn-dark rounded-[999px] px-3 text-sm"
              >
                Edit
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center mt-2">
            <p>Tidak Ditemukan Data Pemohon</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default CardPemohon;
