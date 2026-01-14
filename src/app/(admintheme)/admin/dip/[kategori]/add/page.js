import { notFound } from "next/navigation";
import { DIP_KATEGORI } from "@/configs/appConfig";
import { getDipHeader } from "@/libs/dip";
import Card from "@/components/ui/Card";
import FormAddDip from "./_FormAddDip";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tambah DIP",
};

async function DipAddPage({ params }) {
  const { kategori } = await params;
  if (!kategori) {
    notFound();
  }
  if (!DIP_KATEGORI.includes(kategori)) {
    notFound();
  }
  const headers = await getDipHeader(String(kategori));

  return (
    <Card
      title={`FORMULIR TAMBAH DATA DIP (${kategori})`}
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/dip/${kategori}`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormAddDip kategori={kategori} headers={headers} />
    </Card>
  );
}

export default DipAddPage;
