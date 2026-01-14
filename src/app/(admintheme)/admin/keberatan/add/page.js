import { verifyAuth } from "@/libs/auth";
import { getAdmin } from "@/libs/admin";
import Card from "@/components/ui/Card";
import FormAddKeberatan from "./_FormAddKeberatan";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tambah Keberatan",
};

async function KeberatanAddPage() {
  const auth = await verifyAuth();
  const admin = await getAdmin();
  const isMaster = auth.level < 3;
  const defaultValues = {
    admin_id: auth.id,
    no_regis: "",
    tanggal: null,
    email: "",
    nama: "",
    nomor_identitas: "",
    kategori: "",
    identitas: null,
    telp: "",
    alamat: "",
    alasan: "",
    tujuan: "",
    file_pendukung: null,
  };

  return (
    <Card
      title="FORMULIR TAMBAH DATA KEBERATAN"
      subtitle={`*) Wajib Diisi`}
      noborder={false}
    >
      <FormAddKeberatan
        isMaster={isMaster}
        admin={admin}
        defaultValues={defaultValues}
      />
    </Card>
  );
}

export default KeberatanAddPage;
