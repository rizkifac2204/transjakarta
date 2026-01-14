import { notFound } from "next/navigation";
import { LAPORAN_KATEGORI } from "@/configs/appConfig";
import { getLaporanHeader } from "@/libs/laporan";
import Card from "@/components/ui/Card";
import FormAddLaporan from "./_FormAddLaporan";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tambah Laporan",
};

async function LaporanAddPage({ params }) {
  const { kategori } = await params;
  if (!kategori) {
    notFound();
  }
  if (!LAPORAN_KATEGORI.includes(kategori)) {
    notFound();
  }
  const headers = await getLaporanHeader(String(kategori));

  return (
    <Card
      title={`FORMULIR TAMBAH DATA LAPORAN (${kategori})`}
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/laporan/${kategori}`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormAddLaporan kategori={kategori} headers={headers} />
    </Card>
  );
}

export default LaporanAddPage;
