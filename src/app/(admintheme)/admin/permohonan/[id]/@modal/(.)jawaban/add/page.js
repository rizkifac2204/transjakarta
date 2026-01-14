import { verifyAuth } from "@/libs/auth";
import { getAdmin } from "@/libs/admin";
import { getPermohonanDetailById } from "@/libs/permohonan";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormAddJawaban from "../../../jawaban/add/_FormAddJawaban";

async function JawabanAddModal({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getPermohonanDetailById(parseInt(id));
  if (!data) notFound();

  const auth = await verifyAuth();
  const admin = await getAdmin();
  const isMaster = auth.level < 3;
  const defaultValues = {
    admin_id: auth.id,
    status: data?.status || "",
    jenis: "",
    tanggal: null,
    bentuk_fisik: "",
    biaya: "",
    jangka_waktu: "",
    penguasaan: "",
    penghitaman: "",
    pengecualian: "",
    pasal: "",
    konsekuensi: "",
    file_surat_pemberitahuan: null,
    file_informasi: null,
    pesan: "",
    mailed: false,
    whatsapped: false,
  };

  return (
    <Modal>
      <Card
        title="FORMULIR TAMBAH DATA RESPON/JAWABAN PERMOHONAN"
        noborder={false}
      >
        <FormAddJawaban
          permohonan_id={id}
          admin={admin}
          isMaster={isMaster}
          defaultValues={defaultValues}
          isModal={true}
        />
      </Card>
    </Modal>
  );
}

export default JawabanAddModal;
