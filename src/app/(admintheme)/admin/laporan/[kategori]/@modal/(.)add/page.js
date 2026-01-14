import { notFound } from "next/navigation";
import { LAPORAN_KATEGORI } from "@/configs/appConfig";
import { getLaporanHeader } from "@/libs/laporan";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormAddLaporan from "../../add/_FormAddLaporan";

export const dynamic = "force-dynamic";

async function LaporanAddModal({ params }) {
  const { kategori } = await params;
  if (!kategori) {
    notFound();
  }
  if (!LAPORAN_KATEGORI.includes(kategori)) {
    notFound();
  }
  const headers = await getLaporanHeader(String(kategori));

  return (
    <Modal>
      <Card title={`FORMULIR TAMBAH DATA LAPORAN (${kategori})`}>
        <FormAddLaporan kategori={kategori} headers={headers} />
      </Card>
    </Modal>
  );
}

export default LaporanAddModal;
