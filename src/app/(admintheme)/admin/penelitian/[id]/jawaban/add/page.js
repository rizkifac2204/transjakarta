import { verifyAuth } from "@/libs/auth";
import { getAdmin } from "@/libs/admin";
import { getPenelitianDetailById } from "@/libs/penelitian";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Card from "@/components/ui/Card";
import FormAddJawaban from "./_FormAddJawaban";
import ActionJawabanAdd from "./_Action";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tambah Jawaban",
};

async function JawabanAddPage({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getPenelitianDetailById(parseInt(id));
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
    file_surat_pemberitahuan: null,
    file_informasi: null,
    pesan: "",
    mailed: false,
    whatsapped: false,
  };

  return (
    <Card
      title="FORMULIR TAMBAH DATA RESPON/JAWABAN PERMOHONAN PENELITIAN"
      headerslot={<ActionJawabanAdd penelitian_id={id} />}
      noborder={false}
    >
      <FormAddJawaban
        penelitian_id={id}
        admin={admin}
        isMaster={isMaster}
        defaultValues={defaultValues}
      />
    </Card>
  );
}

export default JawabanAddPage;
