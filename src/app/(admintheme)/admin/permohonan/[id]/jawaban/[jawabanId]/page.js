import { getJawabanDetailById } from "@/libs/jawaban";
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
  const permohonan_id = decodeOrNotFound(params.id);
  const data = await getJawabanDetailById(parseInt(jawabanId));
  if (!data) notFound();

  return (
    <Card
      noborder={false}
      title={"DETAIL RESPON/JAWABAN PERMOHONAN"}
      headerslot={
        <ActionJawabanDetail
          permohonan_id={permohonan_id}
          jawaban_id={jawabanId}
        />
      }
    >
      <ContentJawabanDetail data={data} />
    </Card>
  );
}

export default JawabanDetailPage;
