import { verifyAuth } from "@/libs/auth";
import { getAdmin } from "@/libs/admin";
import { getJawabanPenelitianDetailById } from "@/libs/jawaban-penelitian";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormEditJawaban from "../../../../jawaban/[jawabanId]/edit/_FormEditJawaban";

async function JawabanEditModal({ params }) {
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
    <Modal>
      <Card title="FORMULIR EDIT RESPON PENELITIAN" noborder={false}>
        <FormEditJawaban
          admin={admin}
          isMaster={isMaster}
          defaultValues={defaultValues}
          isModal={true}
        />
      </Card>
    </Modal>
  );
}

export default JawabanEditModal;
