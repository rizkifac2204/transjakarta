import { verifyAuth } from "@/libs/auth";
import { getAdmin } from "@/libs/admin";
import { getJawabanPenelitianDetailById } from "@/libs/jawaban-penelitian";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Card from "@/components/ui/Card";
import ActionJawabanEdit from "./_Action";
import FormEditJawaban from "./_FormEditJawaban";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Jawaban",
};

async function JawabanEditPage({ params }) {
  const jawabanId = decodeOrNotFound(params.jawabanId);
  const penelitian_id = decodeOrNotFound(params.id);
  const data = await getJawabanPenelitianDetailById(parseInt(jawabanId));
  if (!data) notFound();

  const auth = await verifyAuth();
  const admin = await getAdmin();
  const isMaster = auth.level < 3;

  const defaultValues = {
    id: jawabanId,
    penelitian_id: penelitian_id,
    admin_id: isMaster ? data?.admin_id || auth.id : data?.admin_id,
    jenis: data?.jenis || "",
    tanggal: data?.tanggal ? new Date(data.tanggal) : null,
    pesan: data?.pesan || "",
    file_surat_pemberitahuan: null,
    file_informasi: null,
    status_file_surat_pemberitahuan: "keep",
    status_file_informasi: "keep",
  };

  return (
    <Card
      title="FORMULIR EDIT DATA RESPON/JAWABAN PERMOHONAN PENELITIAN"
      headerslot={
        <ActionJawabanEdit
          penelitian_id={penelitian_id}
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
