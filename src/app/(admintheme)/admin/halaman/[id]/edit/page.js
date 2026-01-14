import { verifyAuth } from "@/libs/auth";
import { getHalamanById } from "@/libs/halaman";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { encodeId } from "@/libs/hash/hashId";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import FormHalaman from "../../_FormHalaman";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Display Website",
};

async function HalamanEditPage({ params }) {
  const auth = await verifyAuth();
  if (auth?.level > 2) notFound();
  const id = decodeOrNotFound(params.id);
  const data = await getHalamanById(parseInt(id));
  if (!data) notFound();

  const defaultValues = {
    id: data?.id,
    slug: data?.slug || "",
    judul: data?.judul || "",
    isi: data?.isi || "",
  };

  return (
    <Card
      title="FORMULIR TAMBAH HALAMAN"
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/halaman/${encodeId(id)}`}>
          <Icon icon="solar:eye-broken" />
        </Link>
      }
    >
      <FormHalaman defaultValues={defaultValues} isEdit={true} />
    </Card>
  );
}

export default HalamanEditPage;
