import React from "react";
import {
  getTrashPermohonanDetailById,
  getTrashKeberatanDetailById,
  getTrashPenelitianDetailById,
} from "@/libs/trash";
import Card from "@/components/ui/Card";
import {
  DetailKeberatanTrash,
  DetailPermohonanTrash,
  DetailPenelitianTrash,
} from "../../_ContentDetailTrash";
import { decodeId } from "@/libs/hash/hashId";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Detail Data Dihapus",
};

async function DetailTrashPage({ params }) {
  const { kategori } = params;
  const id = decodeId(params.id);
  if (
    !kategori ||
    !["keberatan", "permohonan", "penelitian"].includes(kategori)
  ) {
    notFound();
  }

  let data = null;
  switch (kategori) {
    case "permohonan":
      data = await getTrashPermohonanDetailById(parseInt(id));
      break;
    case "keberatan":
      data = await getTrashKeberatanDetailById(parseInt(id));
      break;
    case "penelitian":
      data = await getTrashPenelitianDetailById(parseInt(id));
      break;
  }

  if (!data) notFound();

  return (
    <Card title={`DETAIL ${kategori?.toUpperCase()} DIHAPUS`} noborder={false}>
      {kategori === "permohonan" && (
        <DetailPermohonanTrash data={data} kategori={kategori} />
      )}
      {kategori === "keberatan" && (
        <DetailKeberatanTrash data={data} kategori={kategori} />
      )}
      {kategori === "penelitian" && (
        <DetailPenelitianTrash data={data} kategori={kategori} />
      )}
    </Card>
  );
}

export default DetailTrashPage;
