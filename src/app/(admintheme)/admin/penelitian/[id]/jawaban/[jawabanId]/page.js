import { getJawabanPenelitianDetailById } from "@/libs/jawaban-penelitian";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import Card from "@/components/ui/Card";
import ContentJawabanDetail from "./_Content";
import ActionJawabanDetail from "./_Action";

export const metadata = {
  title: "Detail Jawaban",
};

async function JawabanDetailPage({ params }) {
  const jawabanId = decodeOrNotFound(params.jawabanId);
  const penelitian_id = decodeOrNotFound(params.id);
  const data = await getJawabanPenelitianDetailById(parseInt(jawabanId));
  if (!data) notFound();

  return (
    <Card
      noborder={false}
      title={"DETAIL RESPON/JAWABAN PERMOHONAN PENELITIAN"}
      headerslot={
        <ActionJawabanDetail
          penelitian_id={penelitian_id}
          jawaban_id={jawabanId}
        />
      }
    >
      <ContentJawabanDetail data={data} />
    </Card>
  );
}

export default JawabanDetailPage;
