import { verifyAuth } from "@/libs/auth";
import { getAdmin } from "@/libs/admin";
import { getJawabanDetailById } from "@/libs/jawaban";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Card from "@/components/ui/Card";
import FormEditJawaban from "./_FormEditJawaban";
import ActionJawabanEdit from "./_Action";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Jawaban",
};

async function JawabanEditPage({ params }) {
  const jawabanId = decodeOrNotFound(params.jawabanId);
  const permohonan_id = decodeOrNotFound(params.id);
  const data = await getJawabanDetailById(parseInt(jawabanId));
  if (!data) notFound();

  const auth = await verifyAuth();
  const admin = await getAdmin();
  const isMaster = auth.level < 3;

  const defaultValues = {
    id: jawabanId,
    permohonan_id: permohonan_id,
    admin_id: isMaster ? data?.admin_id || auth.id : data?.admin_id,
    jenis: data?.jenis || "",
    tanggal: data?.tanggal ? new Date(data.tanggal) : null,
    bentuk_fisik: data?.bentuk_fisik || "",
    biaya: data?.biaya || "",
    jangka_waktu: data?.jangka_waktu || "",
    penguasaan: data?.penguasaan || "",
    penghitaman: data?.penghitaman || "",
    pengecualian: data?.pengecualian || "",
    pasal: data?.pasal || "",
    konsekuensi: data?.konsekuensi || "",
    pesan: data?.pesan || "",
    file_surat_pemberitahuan: null,
    file_informasi: null,
    status_file_surat_pemberitahuan: "keep",
    status_file_informasi: "keep",
  };

  return (
    <Card
      title="FORMULIR EDIT DATA RESPON/JAWABAN PERMOHONAN"
      headerslot={
        <ActionJawabanEdit
          permohonan_id={permohonan_id}
          jawaban_id={jawabanId}
        />
      }
      noborder={false}
    >
      <FormEditJawaban
        admin={admin}
        isMaster={isMaster}
        defaultValues={defaultValues}
      />
    </Card>
  );
}

export default JawabanEditPage;
