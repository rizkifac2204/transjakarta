import React from "react";
import {
  getTrashPermohonanDetailById,
  getTrashKeberatanDetailById,
  getTrashPenelitianDetailById,
} from "@/libs/trash";
import {
  DetailKeberatanTrash,
  DetailPermohonanTrash,
  DetailPenelitianTrash,
} from "../../../_ContentDetailTrash";
import { decodeId } from "@/libs/hash/hashId";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";

export const dynamic = "force-dynamic";

async function DetailTrashModal({ params }) {
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
    <Modal>
      <Card title={`${kategori?.toUpperCase()} DIHAPUS`} noborder={false}>
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
    </Modal>
  );
}

export default DetailTrashModal;
