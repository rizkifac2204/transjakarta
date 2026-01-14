import { verifyAuth } from "@/libs/auth";
import { getHalamanById } from "@/libs/halaman";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";

import Card from "@/components/ui/Card";
import ActionDetailHalaman from "./_ActionDetailHalaman";
import ContentSlug from "@/components/front/ContentSlug";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Detail Display Website",
};

async function HalamanDetailPage({ params }) {
  const auth = await verifyAuth();
  if (auth?.level > 2) notFound();
  const id = decodeOrNotFound(params.id);
  const data = await getHalamanById(parseInt(id));
  if (!data) notFound();

  return (
    <Card
      title={`PREVIEW DISPLAY ${data.judul} (${data?.slug})`}
      noborder={false}
      headerslot={<ActionDetailHalaman data={data} />}
    >
      <ContentSlug slug={data?.slug} />
    </Card>
  );
}

export default HalamanDetailPage;
