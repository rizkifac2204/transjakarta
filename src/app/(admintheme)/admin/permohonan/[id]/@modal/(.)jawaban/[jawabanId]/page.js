import { getJawabanDetailById } from "@/libs/jawaban";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Modal from "@/components/ui/Modal";
import ContentJawabanDetail from "../../../jawaban/[jawabanId]/_Content";

async function JawabanDetailModal({ params }) {
  const jawabanId = decodeOrNotFound(params.jawabanId);
  const data = await getJawabanDetailById(parseInt(jawabanId));
  if (!data) notFound();

  return (
    <Modal>
      <div className="p-6">
        <ContentJawabanDetail data={data} isModal={true} />
      </div>
    </Modal>
  );
}

export default JawabanDetailModal;
