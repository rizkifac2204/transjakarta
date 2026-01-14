import Link from "next/link";
import { formatedDate } from "@/utils/formatDate";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ActionJawaban from "./_ActionJawaban";
import SendMailAndWa from "./_SendMailAndWa";
import { PATH_UPLOAD } from "@/configs/appConfig";

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

function JawabanCard({ item, section, foreignKey }) {
  const hasPemberitahuan = Boolean(item?.file_surat_pemberitahuan);
  const hasInformasi = Boolean(item?.file_informasi);
  const path = section == "permohonan" ? "jawaban" : "jawabanpenelitian";

  return (
    <Card
      key={item.id}
      title={
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-md ${getJenisColor(
              item?.jenis
            )} text-sm font-semibold`}
          >
            {getInitials(item?.jenis)}
          </div>
          <div className="font-semibold truncate">{item?.jenis || "-"}</div>
        </div>
      }
      headerslot={
        <ActionJawaban item={item} section={section} foreignKey={foreignKey} />
      }
    >
      <p className="text-sm">
        {item?.pesan?.length > 100
          ? item?.pesan.slice(0, 100) + "..."
          : item.pesan || "-"}
      </p>

      <div className="text-sm mt-2">
        {"- "}
        {formatedDate(item?.tanggal, true)}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 font-medium my-4">
        <div className="flex flex-col justify-center gap-1">
          <p>Pemberitahuan</p>
          <Link
            href={
              hasPemberitahuan
                ? `/api/services/file/uploads/${PATH_UPLOAD[path].pemberitahuan}/${item.file_surat_pemberitahuan}`
                : "#"
            }
            {...(hasPemberitahuan && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
            scroll={false}
          >
            <Badge
              label={hasPemberitahuan ? "Lihat" : "No File"}
              className={
                hasPemberitahuan
                  ? "bg-green-100 text-green-800"
                  : "bg-danger-100 text-danger-800"
              }
              icon="solar:cloud-file-broken"
            />
          </Link>
        </div>
        <div className="flex flex-col justify-center gap-1">
          <p>File Informasi</p>
          <Link
            href={
              hasInformasi
                ? `/api/services/file/uploads/${PATH_UPLOAD[path].informasi}/${item.file_informasi}`
                : "#"
            }
            {...(hasInformasi && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
            scroll={false}
          >
            <Badge
              label={hasInformasi ? "Lihat" : "No File"}
              className={
                hasInformasi
                  ? "bg-green-100 text-green-800"
                  : "bg-danger-100 text-danger-800"
              }
              icon="solar:cloud-file-broken"
            />
          </Link>
        </div>
      </div>

      <SendMailAndWa data={item} section={section} foreignKey={foreignKey} />

      <p className="font-thin text-xs mt-3">
        Dibuat : {formatedDate(item?.created_at, true, true)}
      </p>
    </Card>
  );
}

export default JawabanCard;
