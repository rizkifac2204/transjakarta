import { notFound } from "next/navigation";
import { DIP_KATEGORI } from "@/configs/appConfig";
import { getDipHeader } from "@/libs/dip";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormAddDip from "../../add/_FormAddDip";

export const dynamic = "force-dynamic";

async function DipAddModal({ params }) {
  const { kategori } = await params;
  if (!kategori) {
    notFound();
  }
  if (!DIP_KATEGORI.includes(kategori)) {
    notFound();
  }
  const headers = await getDipHeader(String(kategori));

  return (
    <Modal>
      <Card title={`FORMULIR TAMBAH DATA DIP (${kategori})`}>
        <FormAddDip kategori={kategori} headers={headers} />
      </Card>
    </Modal>
  );
}

export default DipAddModal;
